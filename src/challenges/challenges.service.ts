import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateChallengeMatchDTO } from 'src/matches/dto/create-challenge-match.dto';
import { MatchesService } from 'src/matches/matches.service';
import { PlayersService } from 'src/players/players.service';
import { ArrayHelper } from 'src/shared/helpers/array-helper';
import { ChallengesValidatorService } from './challenges-validator.service';
import { CreateChallengeDTO } from './dto/create-challenge.dto';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';
import { ChallengeStatusEnum } from './enums/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {

  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
    private readonly challengesValidatorService: ChallengesValidatorService,
    private readonly matchesService: MatchesService
  ) { }

  async listAll(): Promise<Challenge[]> {
    return await this.challengeModel.find().populate('players').exec();
  }

  async findById(id: string): Promise<Challenge> {
    return await this.challengeModel.findById(id);
  }

  async findByPlayerId(playerId: string): Promise<Challenge[]> {
    const player = await this.playersService.findById(playerId);

    this.playersService.validatePlayerExistence(player, playerId);

    return await this.challengeModel.find().where('players').in([playerId]).exec();
  }

  async createChallenge(createChallengeDTO: CreateChallengeDTO): Promise<Challenge> {
    await this.challengesValidatorService.validatePlayersForChallenge(createChallengeDTO);

    const { players, playerRequesterId, challengeDateTime } = createChallengeDTO;

    const requesterPlayer = await this.playersService.findById(playerRequesterId);

    const challengeForSaving = new this.challengeModel({
      challengeDateTime,
      players,
      status: ChallengeStatusEnum.PENDING,
      requestDateTime: new Date(),
      requester: requesterPlayer,
      category: requesterPlayer.category
    });

    return await challengeForSaving.save();
  }

  async updateChallenge(updateChallengeDTO: UpdateChallengeDTO, id: string): Promise<Challenge> {
    let challenge = await this.findById(id);

    this.challengesValidatorService.validateChallengeExistence(challenge, id);

    challenge = this.updateChallengeInfo(updateChallengeDTO, challenge);
    
    return await challenge.save();
  }

  async cancelChallenge(id: string): Promise<void> {
    const challenge = await this.findById(id);

    this.challengesValidatorService.validateChallengeExistence(challenge, id);

    challenge.status = ChallengeStatusEnum.CANCELLED;

    await challenge.update();
  }

  async createChallengeMatch(createChallengeMatchDTO: CreateChallengeMatchDTO, id: string): Promise<Challenge> {
    const challenge = await this.findById(id);

    this.challengesValidatorService.validateChallengeExistence(challenge, id);
    await this.challengesValidatorService.validatePlayerInChallenge(createChallengeMatchDTO.def, challenge);

    const match = await this.matchesService.createMatchFromChallenge(challenge, createChallengeMatchDTO);

    challenge.status = ChallengeStatusEnum.DONE;
    challenge.match = match;

    return await challenge.update();    
  }

  private updateChallengeInfo(updateChallengeDTO: UpdateChallengeDTO, challenge: Challenge): Challenge {
    const { status, challengeDateTime } = updateChallengeDTO;

    if (status && (status === ChallengeStatusEnum.ACCEPTED ||
                   status === ChallengeStatusEnum.DENIED ||
                   status === ChallengeStatusEnum.CANCELLED)) {
      challenge.status = status;
    }

    if (challengeDateTime) {
      challenge.challengeDateTime = challengeDateTime;
    }

    return challenge;
  }

}

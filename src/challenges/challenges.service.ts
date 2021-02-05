import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { ArrayHelper } from 'src/shared/helpers/array-helper';
import { CreateChallengeDTO } from './dto/create-challenge.dto';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';
import { ChallengeStatusEnum } from './enums/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {

  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService
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
    await this.validatePlayersForChallenge(createChallengeDTO);

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

    this.validateChallengeExistence(challenge, id);

    challenge = this.updateChallengeInfo(updateChallengeDTO, challenge);
    
    return await challenge.save();
  }

  async cancelChallenge(id: string): Promise<void> {
    const challenge = await this.findById(id);

    this.validateChallengeExistence(challenge, id);

    challenge.status = ChallengeStatusEnum.CANCELLED;

    await challenge.save();
  }

  async validatePlayersForChallenge(createChallengeDTO: CreateChallengeDTO): Promise<void> {
    const { players: playersIds } = createChallengeDTO;

    await this.validatePlayersForChallengeExistence(playersIds);

    await this.validateChallengeRequester(createChallengeDTO);

    await this.validatePlayersInSameCategory(playersIds);
  }
  
  async validatePlayersForChallengeExistence(playersIds: string[]): Promise<void> {
    playersIds.forEach(async (playerId) => {
      const player = await this.playersService.findById(playerId);
  
      this.playersService.validatePlayerExistence(player, playerId);
    });
  }

  async validateChallengeRequester(createChallengeDTO: CreateChallengeDTO): Promise<void> {
    const isRequesterInPlayers = createChallengeDTO.players.some(playerId => playerId === createChallengeDTO.playerRequesterId);

    if (!isRequesterInPlayers) {
      throw new BadRequestException(`Requester player with given id ${createChallengeDTO.playerRequesterId} is not within challenge's player!`);
    }
  }

  async validatePlayersInSameCategory(playersIds: string[]): Promise<void> {
    const categories = [];
    
    playersIds.forEach(async (playerId) => {
      const playerCategory = await this.categoriesService.findByPlayerId(playerId);

      categories.push(playerCategory.category);
    });

    if (!ArrayHelper.areAllValuesTheEquals(categories)) {
      throw new BadRequestException(`Challenge's player are not from the same category!`);
    }
  }

  validateChallengeExistence(challenge: Challenge, id) {
    if (!challenge) {
      throw new BadRequestException(`Challenge with given _id ${id} was not found!`);
    }
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

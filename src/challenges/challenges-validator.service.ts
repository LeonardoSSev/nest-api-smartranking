import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateChallengeMatchDTO } from 'src/matches/dto/create-challenge-match.dto';
import { MatchesService } from 'src/matches/matches.service';
import { PlayersService } from 'src/players/players.service';
import { ArrayHelper } from 'src/shared/helpers/array-helper';
import { CreateChallengeDTO } from './dto/create-challenge.dto';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';
import { ChallengeStatusEnum } from './enums/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesValidatorService {

  constructor(
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService
  ) { }
  

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

  validateChallengeExistence(challenge: Challenge, id): void {
    if (!challenge) {
      throw new BadRequestException(`Challenge with given _id ${id} was not found!`);
    }
  }

  async validatePlayerInChallenge(playerId: string, challenge: Challenge): Promise<void> {
    const { players } = challenge;

    const storedPlayer = await this.playersService.findById(playerId);
    this.playersService.validatePlayerExistence(storedPlayer, playerId);

    const isPlayerInChallenge = players.some(async (player) => {
      return player.id === storedPlayer.id;
    })

    if (!isPlayerInChallenge) {
      throw new BadRequestException(`Winner player with given _id ${playerId} is not in this challenge!`);
    }
  }

}

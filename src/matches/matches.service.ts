import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { Challenge } from 'src/challenges/interfaces/challenge.interface';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeMatchDTO } from './dto/create-challenge-match.dto';
import { Match } from './interfaces/match.interface';

@Injectable()
export class MatchesService {

  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly categoriesService: CategoriesService
  ) {}

  async listAll(): Promise<Match[]> {
    return await this.matchModel.find();
  }

  async findById(id: string): Promise<Match> {
    return await this.matchModel.findById(id).exec();
  }

  async createMatchFromChallenge(challenge: Challenge, createChallengeMatchDTO: CreateChallengeMatchDTO): Promise<Match> {
    const { players, category: categoryName } = challenge;
    const { def, result } = createChallengeMatchDTO;

    const category = await this.categoriesService.findById(categoryName);

    return await new this.matchModel({
      players,
      category,
      def,
      result
    }).save();
  }
}

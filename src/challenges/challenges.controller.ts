import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDTO } from './dto/create-challenge.dto';
import { CreateChallengeMatchDTO } from '../matches/dto/create-challenge-match.dto';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';

@Controller('api/v1/challenges')
export class ChallengesController {

  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  async listAll(): Promise<Challenge[]> {
    return await this.challengesService.listAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Challenge> {
    return await this.challengesService.findById(id);
  }

  @Get('players/:playerId')
  async findByPlayerId(@Param('playerId') playerId: string): Promise<Challenge[]> {
    return await this.challengesService.findByPlayerId(playerId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(@Body() createChallengeDTO: CreateChallengeDTO): Promise<Challenge> {
    return await this.challengesService.createChallenge(createChallengeDTO);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateChallenge(@Body() updateChallengeDTO: UpdateChallengeDTO, @Param('id') id: string): Promise<Challenge> {
    return await this.challengesService.updateChallenge(updateChallengeDTO, id);
  }

  @Delete(':id')
  async cancelChallenge(@Param('id') id: string): Promise<void> {
    return await this.challengesService.cancelChallenge(id);
  }

  @Post(':id/matches')
  async createChallengeMatch(@Body() createChallengeMatch: CreateChallengeMatchDTO, @Param('id') id: string): Promise<Challenge> {
    return await this.challengesService.createChallengeMatch(createChallengeMatch, id);
  }

}

import { Controller, Get, Param } from '@nestjs/common';
import { Match } from './interfaces/match.interface';
import { MatchesService } from './matches.service';

@Controller('api/v1/matches')
export class MatchesController {

  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async listAll(): Promise<Match[]> {
    return await this.matchesService.listAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Match> {
    return await this.matchesService.findById(id);
  }
}

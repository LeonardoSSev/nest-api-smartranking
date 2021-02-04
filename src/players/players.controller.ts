import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { RequestParameterValidation } from 'src/shared/pipes/RequestParameterValidation.pipe';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { UpdatePlayerDTO } from './dto/update-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {

  constructor(private readonly playerService: PlayersService) { }

  @Get()
  async listAll(): Promise<Player[]> {
    return await this.playerService.listAll();
  }

  @Get(':_id')
  async findById(@Param('_id', RequestParameterValidation) _id: string): Promise<Player> {
    return await this.playerService.findById(_id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDTO: CreatePlayerDTO): Promise<void> {
    return await this.playerService.createPlayer(createPlayerDTO);
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(@Body() updatePlayerDTO: UpdatePlayerDTO, @Param('_id', RequestParameterValidation) _id: string): Promise<void> {
    return await this.playerService.updatePlayer(updatePlayerDTO, _id);
  }

  @Delete(':_id')
  async deletePlayer(@Param('_id', RequestParameterValidation) _id: string): Promise<void> {
    return await this.playerService.deletePlayer(_id);
  }
  
}

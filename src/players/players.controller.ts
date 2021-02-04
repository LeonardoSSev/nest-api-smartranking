import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { UpdatePlayerDTO } from './dto/update-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {

  constructor(private readonly playerService: PlayersService) { }

  @Get()
  async listAll() {
    return await this.playerService.listAll();
  }

  @Get(':email')
  async findByEmail(@Param('email') email: string) {
    return await this.playerService.findByEmail(email);
  }

  @Post()
  async createPlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    await this.playerService.createPlayer(createPlayerDTO);
  }

  @Put(':email')
  async updatePlayer(@Body() updatePlayerDTO: UpdatePlayerDTO, @Param('email') email: string) {
    await this.playerService.updatePlayer(updatePlayerDTO, email);
  }

  @Delete(':email')
  async deletePlayer(@Param('email') email: string) {
    await this.playerService.deletePlayer(email);
  }
  
}

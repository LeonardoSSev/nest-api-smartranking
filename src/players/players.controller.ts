import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {

  constructor(private readonly playerService: PlayersService) { }

  @Post()
  async createPlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    await this.playerService.createPlayer(createPlayerDTO);
  }
}

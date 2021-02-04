import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { Player } from './interfaces/player.interface'
import * as uuid from 'uuid';


@Injectable()
export class PlayersService {

  private players: Player[] = [];

  private readonly logger = new Logger(PlayersService.name);

  async createPlayer(createPlayerDTO: CreatePlayerDTO): Promise<void>{
    this.create(createPlayerDTO);
    
  }
  
  private create(createPlayerDTO: CreatePlayerDTO): void {
    const { name, phoneNumber, email } = createPlayerDTO;
    
    const player: Player = {
      name,
      phoneNumber,
      email,
      _id: uuid(),
      ranking: 'A',
      rankingPosition: 1,
      urlPicture: 'https://placeholder.com/180'
    };

    this.logger.log(`player: ${player}`);

    this.players.push(player);

  }
}

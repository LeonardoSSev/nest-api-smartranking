import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { Player } from './interfaces/player.interface'
import { InjectModel } from '@nestjs/mongoose';
import { UpdatePlayerDTO } from './dto/update-player.dto';
import { Model } from 'mongoose';
2
@Injectable()
export class PlayersService {

  private readonly logger = new Logger(PlayersService.name);

  constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) {}

  async createPlayer(createPlayerDTO: CreatePlayerDTO): Promise<void>{
    const { name, phoneNumber, email } = createPlayerDTO;

    const player = {
      name,
      phoneNumber,
      email,
      urlPicture: 'https://placeholder.com/180'
    };

    await this.playerModel.create(player);
  }

  async listAll(): Promise<Player[]> {
    return await this.playerModel.find();
  }

  async findByEmail(email: string): Promise<Player> {
    const player = await this.playerModel.findOne({ email }).exec();

    if (!player) {
      throw new NotFoundException(`Player with given email ${email} was not found!`);
    }

    return player;
  }

  async updatePlayer(updatePlayerDTO: UpdatePlayerDTO, email: string): Promise<void> {
    const { name, urlPicture } = updatePlayerDTO;

    const player: Player = await this.findByEmail(email);

    if (!player) {
      throw new NotFoundException(`Player with given email ${email} was not found!`);
    }

    player.name = name;
    player.urlPicture = urlPicture;

    await player.updateOne(player).exec();
  }

  async deletePlayer(email: string): Promise<void> {
    const player: Player = await this.playerModel.findOneAndDelete({ email });

    if (!player) {
      throw new NotFoundException(`Player with given email ${email} was not found!`);
    }
  }
}

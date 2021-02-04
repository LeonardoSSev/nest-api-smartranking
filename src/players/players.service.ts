import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async createPlayer(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { name, phoneNumber, email, urlPicture = 'https://placeholder.com/180' } = createPlayerDTO;
    
    if (await this.findByEmail(email) != null) {
      throw new BadRequestException(`This e-mail is already being used for another player.`);
    }

    const player = {
      name,
      phoneNumber,
      email,
      urlPicture
    };

    await this.playerModel.create(player);
  }

  async listAll(): Promise<Player[]> {
    return await this.playerModel.find();
  }

  async findById(_id: string): Promise<Player> {
    const player = await this.playerModel.findById(_id).exec();

    if (!player) {
      throw new NotFoundException(`Player with given _id ${_id} was not found!`);
    }

    return player;
  }

  async findByEmail(email: string): Promise<Player> {
    const player = await this.playerModel.findOne({ email }).exec();

    console.log(JSON.stringify(player));
    return player;
  }

  async updatePlayer(updatePlayerDTO: UpdatePlayerDTO, _id: string): Promise<void> {
    const { name, email, phoneNumber, urlPicture } = updatePlayerDTO;

    const player: Player = await this.findById(_id);

    if (!player) {
      throw new NotFoundException(`Player with given _id ${_id} was not found!`);
    }

    if (name) {
      player.name = name;
    }

    if (email) {
      player.email = email;
    }

    if (phoneNumber) {
      player.phoneNumber = phoneNumber;
    }

    if (urlPicture) {
      player.urlPicture = urlPicture;
    }

    await player.updateOne(player).exec();
  }

  async deletePlayer(_id: string): Promise<void> {
    const player: Player = await this.playerModel.findOneAndDelete({ _id });

    if (!player) {
      throw new NotFoundException(`Player with given _id ${_id} was not found!`);
    }
  }
}

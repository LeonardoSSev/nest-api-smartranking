import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { Player } from './interfaces/player.interface'
import { InjectModel } from '@nestjs/mongoose';
import { UpdatePlayerDTO } from './dto/update-player.dto';
import { Model } from 'mongoose';
2
@Injectable()
export class PlayersService {

  constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) {}

  async createPlayer(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
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

    return await this.playerModel.create(player);
  }

  async listAll(): Promise<Player[]> {
    return await this.playerModel.find();
  }

  async findById(_id: string): Promise<Player> {
    const player = await this.playerModel.findById(_id).exec();

    this.validatePlayerExistence(player, _id);

    return player;
  }

  async findByEmail(email: string): Promise<Player> {
    const player = await this.playerModel.findOne({ email }).exec();

    return player;
  }

  async updatePlayer(updatePlayerDTO: UpdatePlayerDTO, _id: string): Promise<Player> {
    let player: Player = await this.findById(_id);

    this.validatePlayerExistence(player, _id);

    player = this.updatePlayerInfo(player, updatePlayerDTO);

    return await this.playerModel.findByIdAndUpdate(_id, {$set: player }).exec();
  }

  async deletePlayer(_id: string): Promise<string> {
    const player: Player = await this.playerModel.findOneAndDelete({ _id });

    this.validatePlayerExistence(player, _id);

    return player._id;
  }

  validatePlayerExistence(player: Player | null, id: string) {
    if (!player) {
      throw new NotFoundException(`Player with given _id ${id} was not found!`);
    }
  }

  private updatePlayerInfo(playerForUpdating: Player, updatePlayerDTO: UpdatePlayerDTO): Player {
    const { name, email, phoneNumber, urlPicture } = updatePlayerDTO;

    if (name) {
      playerForUpdating.name = name;
    }

    if (email) {
      playerForUpdating.email = email;
    }

    if (phoneNumber) {
      playerForUpdating.phoneNumber = phoneNumber;
    }

    if (urlPicture) {
      playerForUpdating.urlPicture = urlPicture;
    }

    return playerForUpdating;
  }
}

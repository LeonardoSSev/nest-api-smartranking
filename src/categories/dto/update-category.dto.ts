import { IsArray, IsOptional, IsString } from "class-validator";
import { Player } from "src/players/interfaces/player.interface";
import { Event } from "../interfaces/category.interface";

export class UpdateCategoryDTO {
  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  events: Array<Event>

  @IsArray()
  @IsOptional()
  players: Array<Player>

}
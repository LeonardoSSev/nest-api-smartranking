import { Document } from "mongoose";
import { Category } from "src/categories/interfaces/category.interface";
import { Player } from "src/players/interfaces/player.interface";

export interface Match extends Document {

  category: Category;

  result: Array<Result>;

  players: Array<Player>;
}

export interface Result {

  set: string;

}
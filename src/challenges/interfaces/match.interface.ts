import { Document } from "mongoose";
import { Player } from "src/players/interfaces/player.interface";

export interface Match extends Document {

  result: Array<Result>;

  players: Array<Player>;
}

export interface Result {

  set: string;

}
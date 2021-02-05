import { Document } from "mongoose";
import { Player } from "src/players/interfaces/player.interface";
import { ChallengeStatusEnum } from "../enums/challenge-status.enum";
import { Match } from "./match.interface";

export interface Challenge extends Document {

  challengeDateTime: Date;

  status: ChallengeStatusEnum | string;

  requestDateTime: Date;

  answerDateTime: Date;

  requester: string;

  category: string;

  players: Array<Player>;

  match: Match;
}

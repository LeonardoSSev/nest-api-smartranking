import { IsArray, IsNotEmpty } from "class-validator";
import { Result } from "../interfaces/match.interface";

export class CreateChallengeMatchDTO {

  @IsNotEmpty()
  def: string;

  @IsNotEmpty()
  @IsArray()
  result: Array<Result>
  
}
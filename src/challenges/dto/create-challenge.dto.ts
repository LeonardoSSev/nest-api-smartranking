import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateChallengeDTO {

  @IsString()
  @IsNotEmpty()
  readonly playerRequesterId: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNotEmpty()
  readonly players: Array<string>;

  @IsDateString()
  @IsNotEmpty()
  readonly challengeDateTime: Date;
}
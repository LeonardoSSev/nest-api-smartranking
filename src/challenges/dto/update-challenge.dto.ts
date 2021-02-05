import {  IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateChallengeDTO {

  @IsString()
  @IsOptional()
  readonly status: string;

  @IsDateString()
  @IsOptional()
  readonly challengeDateTime: Date;
}
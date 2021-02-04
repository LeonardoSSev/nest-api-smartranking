import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdatePlayerDTO {

  @IsString()
  @IsOptional()
  readonly name: string;

  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly phoneNumber: string;
  
  @IsString()
  @IsOptional()
  readonly urlPicture: string;

}
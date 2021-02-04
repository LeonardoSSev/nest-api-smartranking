import { IsNotEmpty } from "class-validator";

export class UpdatePlayerDTO {

  readonly name: string;

  readonly email: string;

  readonly phoneNumber: string;
  
  readonly urlPicture: string;

}
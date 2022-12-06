import { IsEmail, IsString } from 'class-validator';

export class SendContactEmailDTO {
  @IsString()
  // TODO: Maxlength / Minlength
  firstName!: string;

  @IsString()
  // TODO: Maxlength / Minlength
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  // TODO: Maxlength / Minlength
  subject!: string;

  @IsString()
  message!: string;
}

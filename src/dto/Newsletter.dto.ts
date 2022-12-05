import { IsEmail, IsString } from 'class-validator';

export class SuscribeToNewsletterDTO {
  @IsEmail()
  email!: string;
}

export class UnsuscribeFromNewsletterDTO {
  @IsString()
  email!: string;
}

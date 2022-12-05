import { IsEmail } from 'class-validator';

export class SuscribteToNewsletterDTO {
  @IsEmail()
  email!: string;
}

import { IsNumber, IsString } from 'class-validator';

export class MulterFile {
  @IsString()
  fieldname!: string;

  @IsString()
  originalname!: string;

  @IsString()
  filename!: string;

  @IsString()
  encoding!: string;

  @IsString()
  mimetype!: string;

  @IsNumber()
  size!: number;

  @IsString()
  path!: string;
}

import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCurrencyDto {
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @MaxLength(3)
  code: string;

  @IsNotEmpty()
  @MaxLength(3)
  symbol: string;
}

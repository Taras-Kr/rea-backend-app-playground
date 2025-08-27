import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateLocationDto } from 'src/location/dto/create-location.dto';
import { Type } from 'class-transformer';
import { CreatePropertyDto } from './create-property.dto';

export class CreateFullPropertyDto {
  @ApiProperty({ description: "Дані про об'єкт нерухомості" })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreatePropertyDto)
  property: CreatePropertyDto;

  @ApiProperty({ description: 'Дані про місцезнаходження' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateLocationDto)
  location: CreateLocationDto;
}

import { UpdatePropertyDto } from './update-property.dto';
import { UpdateLocationDto } from '../../location/dto/update-location.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFullPropertyDto {
  @ApiProperty({ description: "Дані про об'єкт нерухомості" })
  @IsNotEmpty({ message: "Дані об'єкту нерухомості не можуть бути порожніми" })
  @ValidateNested()
  @Type(() => UpdatePropertyDto)
  property: UpdatePropertyDto;

  @ApiProperty({ description: "Дані про місцезнаходження об'єкту нерухомості" })
  @IsNotEmpty({
    message: "Дані про місцезнаходження об'єкту не можуть бути порожніми",
  })
  @ValidateNested()
  @Type(() => UpdateLocationDto)
  location: UpdateLocationDto;
}

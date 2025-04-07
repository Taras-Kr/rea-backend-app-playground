import { Module } from '@nestjs/common';
import { PropertyTypeService } from './property-type.service';
import { PropertyTypeController } from './property-type.controller';
import { PropertyType } from './entities/property-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyCategoryService } from '../property-category/property-category.service';
import { PropertyCategory } from '../property-category/entities/property-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyType, PropertyCategory])],
  controllers: [PropertyTypeController],
  providers: [PropertyTypeService, PropertyCategoryService],
})
export class PropertyTypeModule {}

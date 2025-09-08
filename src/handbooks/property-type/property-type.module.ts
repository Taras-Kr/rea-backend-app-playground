import { Module } from '@nestjs/common';
import { PropertyTypeService } from './property-type.service';
import { PropertyTypeController } from './property-type.controller';
import { PropertyType } from './entities/property-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyCategoryModule } from '../property-category/property-category.module';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyType]), PropertyCategoryModule],
  controllers: [PropertyTypeController],
  providers: [PropertyTypeService],
  exports: [PropertyTypeService],
})
export class PropertyTypeModule {}

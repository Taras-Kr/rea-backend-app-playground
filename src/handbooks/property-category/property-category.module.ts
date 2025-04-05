import { Module } from '@nestjs/common';
import { PropertyCategoryService } from './property-category.service';
import { PropertyCategoryController } from './property-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyCategory } from './entities/property-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyCategory])],
  controllers: [PropertyCategoryController],
  providers: [PropertyCategoryService],
})
export class PropertyCategoryModule {}

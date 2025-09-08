import { forwardRef, Module } from '@nestjs/common';
import { ImageGalleryService } from './image-gallery.service';
import { ImageGalleryController } from './image-gallery.controller';
import { ImageGallery } from './entities/image-gallery.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyModule } from '../property/property.module';
import { PropertyTypeModule } from '../handbooks/property-type/property-type.module';
import { LocationModule } from '../location/location.module';
import { PropertyCategoryModule } from '../handbooks/property-category/property-category.module';
import { GeocodingModule } from '../geocoding/geocoding.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageGallery]),
    forwardRef(() => PropertyModule),
    PropertyTypeModule,
    LocationModule,
    PropertyCategoryModule,
    GeocodingModule,
  ],
  controllers: [ImageGalleryController],
  providers: [ImageGalleryService],
  exports: [ImageGalleryService],
})
export class ImageGalleryModule {}

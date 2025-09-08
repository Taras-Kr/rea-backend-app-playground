import { forwardRef, Module } from '@nestjs/common';
import { PropertyImageService } from './property-image.service';
import { PropertyImageController } from './property-image.controller';
import { PropertyImage } from './entities/property-image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from '../minio/minio.module';
import { PropertyModule } from '../property/property.module';
import { PropertyTypeModule } from '../handbooks/property-type/property-type.module';
import { LocationModule } from '../location/location.module';
import { PropertyCategoryModule } from '../handbooks/property-category/property-category.module';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { ImageGalleryModule } from '../image-gallery/image-gallery.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropertyImage]),
    forwardRef(() => MinioModule),
    PropertyModule,
    PropertyTypeModule,
    LocationModule,
    PropertyCategoryModule,
    GeocodingModule,
    ImageGalleryModule,
  ],
  controllers: [PropertyImageController],
  providers: [PropertyImageService],
  exports: [TypeOrmModule],
})
export class PropertyImageModule {}

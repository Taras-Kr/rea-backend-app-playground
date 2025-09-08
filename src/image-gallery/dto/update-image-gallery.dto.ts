import { PartialType } from '@nestjs/swagger';
import { CreateImageGalleryDto } from './create-image-gallery.dto';

export class UpdateImageGalleryDto extends PartialType(CreateImageGalleryDto) {}

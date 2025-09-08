import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { ImageGallery } from '../../image-gallery/entities/image-gallery.entity';

@Entity({ name: 'property-images' })
export class PropertyImage extends BaseEntity {
  @ManyToOne(
    () => ImageGallery,
    (imageGallery) => imageGallery.propertyImages,
    {},
  )
  @JoinColumn({ name: 'gallery_uuid', referencedColumnName: 'uuid' })
  gallery: ImageGallery;

  @Column({ type: 'uuid', nullable: false, name: 'gallery_uuid' })
  gallery_uuid: string;

  @Column('varchar', { nullable: false, name: 'file_name' })
  file_name: string;

  @Column('varchar', { nullable: false, name: 'url' })
  url: string;

  @Column('integer', { nullable: true, name: 'position', default: 0 })
  position: number;

  @Column('boolean', { nullable: true, default: false })
  is_primary: boolean;

  @Column('varchar', { nullable: true, name: 'description' })
  description: string;
}

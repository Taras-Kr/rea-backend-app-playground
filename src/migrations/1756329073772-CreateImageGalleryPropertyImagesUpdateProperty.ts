import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateImageGalleryPropertyImagesUpdateProperty1756329073772 implements MigrationInterface {
    name = 'CreateImageGalleryPropertyImagesUpdateProperty1756329073772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image-galleries" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "property_uuid" uuid, "description" character varying, CONSTRAINT "REL_f704741df01e057bfd952d9f45" UNIQUE ("property_uuid"), CONSTRAINT "PK_1909a89d497548ad8c434e12ae0" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "property-images" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "gallery_uuid" uuid NOT NULL, "file_name" character varying NOT NULL, "position" integer NOT NULL DEFAULT '0', "is_primary" boolean NOT NULL DEFAULT false, "description" character varying, CONSTRAINT "PK_a67d123f2108ef274a7aa84a744" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "UQ_b7f3b351caf1bdbfbf5afda9f95" UNIQUE ("gallery_uuid")`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_b7f3b351caf1bdbfbf5afda9f95" FOREIGN KEY ("gallery_uuid") REFERENCES "image-galleries"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "image-galleries" ADD CONSTRAINT "FK_f704741df01e057bfd952d9f451" FOREIGN KEY ("property_uuid") REFERENCES "properties"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property-images" ADD CONSTRAINT "FK_c2213c2d7d8cc90c81f22ba3e91" FOREIGN KEY ("gallery_uuid") REFERENCES "image-galleries"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property-images" DROP CONSTRAINT "FK_c2213c2d7d8cc90c81f22ba3e91"`);
        await queryRunner.query(`ALTER TABLE "image-galleries" DROP CONSTRAINT "FK_f704741df01e057bfd952d9f451"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_b7f3b351caf1bdbfbf5afda9f95"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "UQ_b7f3b351caf1bdbfbf5afda9f95"`);
        await queryRunner.query(`DROP TABLE "property-images"`);
        await queryRunner.query(`DROP TABLE "image-galleries"`);
    }

}

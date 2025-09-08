import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUrlColumnToImages1756843520649 implements MigrationInterface {
  name = 'AddUrlColumnToImages1756843520649';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "property-images"
        ADD "url" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "property-images"
        ALTER COLUMN "position" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "property-images"
        ALTER COLUMN "is_primary" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "property-images"
        ALTER COLUMN "is_primary" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "property-images"
        ALTER COLUMN "position" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "property-images" DROP COLUMN "url"`);
  }
}

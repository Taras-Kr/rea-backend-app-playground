import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncSchemaAfterManualRename1749912081863 implements MigrationInterface {
    name = 'SyncSchemaAfterManualRename1749912081863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_types" DROP CONSTRAINT "FK_935bc88bd06c1a018a52bb8a0d6"`);
        await queryRunner.query(`ALTER TABLE "property_types" ADD CONSTRAINT "FK_9339f95755bae1a0adaaa04d005" FOREIGN KEY ("category_uuid") REFERENCES "property_categories"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_types" DROP CONSTRAINT "FK_9339f95755bae1a0adaaa04d005"`);
        await queryRunner.query(`ALTER TABLE "property_types" ADD CONSTRAINT "FK_935bc88bd06c1a018a52bb8a0d6" FOREIGN KEY ("category_uuid") REFERENCES "property_categories"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

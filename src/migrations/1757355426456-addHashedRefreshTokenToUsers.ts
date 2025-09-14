import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHashedRefreshTokenToUsers1757355426456 implements MigrationInterface {
    name = 'AddHashedRefreshTokenToUsers1757355426456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "hashed_refresh_token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "hashed_refresh_token"`);
    }

}

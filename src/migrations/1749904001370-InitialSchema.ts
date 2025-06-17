import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1749904001370 implements MigrationInterface {
  name = 'InitialSchema1749904001370';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user_types"
                             (
                                 "uuid"       uuid                  NOT NULL DEFAULT uuid_generate_v4(),
                                 "created_at" TIMESTAMP             NOT NULL DEFAULT now(),
                                 "updated_at" TIMESTAMP             NOT NULL DEFAULT now(),
                                 "deleted_at" TIMESTAMP,
                                 "type"       character varying(40) NOT NULL,
                                 "title"      character varying(40) NOT NULL,
                                 CONSTRAINT "PK_ebc3ada3243ba1d6d2eb727a328" PRIMARY KEY ("uuid")
                             )`);
    await queryRunner.query(`CREATE TABLE "user_roles"
                             (
                                 "uuid"       uuid                  NOT NULL DEFAULT uuid_generate_v4(),
                                 "created_at" TIMESTAMP             NOT NULL DEFAULT now(),
                                 "updated_at" TIMESTAMP             NOT NULL DEFAULT now(),
                                 "deleted_at" TIMESTAMP,
                                 "role"       character varying(40) NOT NULL,
                                 "title"      character varying(40) NOT NULL,
                                 "type_uuid"  uuid                  NOT NULL,
                                 CONSTRAINT "PK_d60df0e0fc8413e406f54da4df8" PRIMARY KEY ("uuid")
                             )`);
    await queryRunner.query(`CREATE TABLE "users"
                             (
                                 "uuid"       uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "updated_at" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "deleted_at" TIMESTAMP,
                                 "name"       character varying NOT NULL,
                                 "surname"    character varying,
                                 "email"      character varying NOT NULL,
                                 "password"   character varying NOT NULL,
                                 "type_uuid"  uuid              NOT NULL,
                                 "role_uuid"  uuid              NOT NULL,
                                 CONSTRAINT "PK_951b8f1dfc94ac1d0301a14b7e1" PRIMARY KEY ("uuid")
                             )`);
    await queryRunner.query(`CREATE TABLE "property-categories"
                             (
                                 "uuid"       uuid                   NOT NULL DEFAULT uuid_generate_v4(),
                                 "created_at" TIMESTAMP              NOT NULL DEFAULT now(),
                                 "updated_at" TIMESTAMP              NOT NULL DEFAULT now(),
                                 "deleted_at" TIMESTAMP,
                                 "name"       character varying(100) NOT NULL,
                                 "slug"       character varying(100) NOT NULL,
                                 CONSTRAINT "UQ_48c6379a39c3f4b7e88e29d8251" UNIQUE ("name"),
                                 CONSTRAINT "PK_9f0e3dc5df702b56400590f4bc3" PRIMARY KEY ("uuid")
                             )`);
    await queryRunner.query(`CREATE TABLE "property-types"
                             (
                                 "uuid"          uuid                   NOT NULL DEFAULT uuid_generate_v4(),
                                 "created_at"    TIMESTAMP              NOT NULL DEFAULT now(),
                                 "updated_at"    TIMESTAMP              NOT NULL DEFAULT now(),
                                 "deleted_at"    TIMESTAMP,
                                 "name"          character varying(100) NOT NULL,
                                 "slug"          character varying(100) NOT NULL,
                                 "description"   character varying,
                                 "category_uuid" uuid                   NOT NULL,
                                 CONSTRAINT "UQ_eab896c1a20696a57754a6daa48" UNIQUE ("name"),
                                 CONSTRAINT "UQ_e36b446d9cefe6622d61764be16" UNIQUE ("slug"),
                                 CONSTRAINT "PK_62f2a31f58c343aec0e9bee6519" PRIMARY KEY ("uuid")
                             )`);
    await queryRunner.query(`CREATE TABLE "locations"
                             (
                                 "uuid"             uuid                   NOT NULL DEFAULT uuid_generate_v4(),
                                 "created_at"       TIMESTAMP              NOT NULL DEFAULT now(),
                                 "updated_at"       TIMESTAMP              NOT NULL DEFAULT now(),
                                 "deleted_at"       TIMESTAMP,
                                 "community"        character varying(100),
                                 "settlement"       character varying(100) NOT NULL,
                                 "district"         character varying(100),
                                 "street"           character varying(100),
                                 "building_number"  character varying(6),
                                 "apartment_number" character varying(6),
                                 "description"      text,
                                 "latitude"         numeric(9, 6)                   DEFAULT '0',
                                 "longitude"        numeric(9, 6)                   DEFAULT '0',
                                 CONSTRAINT "PK_4502fed5768cbd4548f5c8b76e8" PRIMARY KEY ("uuid")
                             )`);
    await queryRunner.query(`CREATE TABLE "characteristic_value"
                             (
                                 "uuid"                         uuid                   NOT NULL DEFAULT uuid_generate_v4(),
                                 "property_characteristic_uuid" uuid                   NOT NULL,
                                 "value"                        character varying(100) NOT NULL,
                                 "created_at"                   TIMESTAMP              NOT NULL DEFAULT now(),
                                 CONSTRAINT "PK_74b4ad085cf594c41d4e70e8b2e" PRIMARY KEY ("uuid")
                             )`);
    await queryRunner.query(
      `CREATE TYPE "public"."property_characteristics_type_enum" AS ENUM('1', '2', '3', '4')`,
    );
    await queryRunner.query(`CREATE TABLE "property_characteristics"
                             (
                                 "uuid"        uuid                                          NOT NULL DEFAULT uuid_generate_v4(),
                                 "created_at"  TIMESTAMP                                     NOT NULL DEFAULT now(),
                                 "updated_at"  TIMESTAMP                                     NOT NULL DEFAULT now(),
                                 "deleted_at"  TIMESTAMP,
                                 "name"        character varying(50)                         NOT NULL,
                                 "type"        "public"."property_characteristics_type_enum" NOT NULL,
                                 "is_multiple" boolean                                       NOT NULL DEFAULT false,
                                 "description" character varying(250),
                                 CONSTRAINT "UQ_b06154e5074647d0f3860564948" UNIQUE ("name"),
                                 CONSTRAINT "PK_aa9654b2c760608a322a7beaa60" PRIMARY KEY ("uuid")
                             )`);
    await queryRunner.query(`CREATE TABLE "property_characteristic_values"
                             (
                                 "uuid"                         uuid      NOT NULL DEFAULT uuid_generate_v4(),
                                 "created_at"                   TIMESTAMP NOT NULL DEFAULT now(),
                                 "updated_at"                   TIMESTAMP NOT NULL DEFAULT now(),
                                 "deleted_at"                   TIMESTAMP,
                                 "value"                        jsonb     NOT NULL,
                                 "property_uuid"                uuid      NOT NULL,
                                 "property_characteristic_uuid" uuid      NOT NULL,
                                 CONSTRAINT "PK_a41c2f65e2ba9db7ec375437065" PRIMARY KEY ("uuid")
                             )`);
    await queryRunner.query(`CREATE TABLE "properties"
                             (
                                 "uuid"               uuid                   NOT NULL DEFAULT uuid_generate_v4(),
                                 "created_at"         TIMESTAMP              NOT NULL DEFAULT now(),
                                 "updated_at"         TIMESTAMP              NOT NULL DEFAULT now(),
                                 "deleted_at"         TIMESTAMP,
                                 "title"              character varying(150) NOT NULL,
                                 "is_published"       boolean                NOT NULL DEFAULT false,
                                 "gallery_uuid"       uuid,
                                 "property_type_uuid" uuid                   NOT NULL,
                                 "location_uuid"      uuid                   NOT NULL,
                                 CONSTRAINT "PK_cb9e8664676afa1527881060c3b" PRIMARY KEY ("uuid")
                             )`);
    await queryRunner.query(`CREATE TABLE "currencies"
                             (
                                 "uuid"       uuid                  NOT NULL DEFAULT uuid_generate_v4(),
                                 "created_at" TIMESTAMP             NOT NULL DEFAULT now(),
                                 "updated_at" TIMESTAMP             NOT NULL DEFAULT now(),
                                 "deleted_at" TIMESTAMP,
                                 "name"       character varying(20) NOT NULL,
                                 "code"       character varying(3)  NOT NULL,
                                 "symbol"     character varying(3)  NOT NULL,
                                 CONSTRAINT "PK_a6a33b3d91e863c861a99224573" PRIMARY KEY ("uuid")
                             )`);
    await queryRunner.query(`ALTER TABLE "user_roles"
        ADD CONSTRAINT "FK_1f5c951fce36e42190ebd680982" FOREIGN KEY ("type_uuid") REFERENCES "user_types" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD CONSTRAINT "FK_bd63b60655c734f33d2b3a5c302" FOREIGN KEY ("type_uuid") REFERENCES "user_types" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "users"
        ADD CONSTRAINT "FK_b925bcec35ac48b9393685253d6" FOREIGN KEY ("role_uuid") REFERENCES "user_roles" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "property-types"
        ADD CONSTRAINT "FK_935bc88bd06c1a018a52bb8a0d6" FOREIGN KEY ("category_uuid") REFERENCES "property-categories" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "characteristic_value"
        ADD CONSTRAINT "FK_3c552113ba3cd860a17610bc43d" FOREIGN KEY ("property_characteristic_uuid") REFERENCES "property_characteristics" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "property_characteristic_values"
        ADD CONSTRAINT "FK_5e9a64bd51a0ce6ffa71746ee72" FOREIGN KEY ("property_uuid") REFERENCES "properties" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "property_characteristic_values"
        ADD CONSTRAINT "FK_0b19830ee969d0ed217bd5fd5fe" FOREIGN KEY ("property_characteristic_uuid") REFERENCES "property_characteristics" ("uuid") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "properties"
        ADD CONSTRAINT "FK_0c47ddfd88a1b741a054b2d523b" FOREIGN KEY ("property_type_uuid") REFERENCES "property-types" ("uuid") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "properties"
        ADD CONSTRAINT "FK_811ccd8db90986caee471661aae" FOREIGN KEY ("location_uuid") REFERENCES "locations" ("uuid") ON DELETE RESTRICT ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "properties" DROP CONSTRAINT "FK_811ccd8db90986caee471661aae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "properties" DROP CONSTRAINT "FK_0c47ddfd88a1b741a054b2d523b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_characteristic_values" DROP CONSTRAINT "FK_0b19830ee969d0ed217bd5fd5fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property_characteristic_values" DROP CONSTRAINT "FK_5e9a64bd51a0ce6ffa71746ee72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "characteristic_value" DROP CONSTRAINT "FK_3c552113ba3cd860a17610bc43d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "property-types" DROP CONSTRAINT "FK_935bc88bd06c1a018a52bb8a0d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_b925bcec35ac48b9393685253d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_bd63b60655c734f33d2b3a5c302"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_1f5c951fce36e42190ebd680982"`,
    );
    await queryRunner.query(`DROP TABLE "currencies"`);
    await queryRunner.query(`DROP TABLE "properties"`);
    await queryRunner.query(`DROP TABLE "property_characteristic_values"`);
    await queryRunner.query(`DROP TABLE "property_characteristics"`);
    await queryRunner.query(
      `DROP TYPE "public"."property_characteristics_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "characteristic_value"`);
    await queryRunner.query(`DROP TABLE "locations"`);
    await queryRunner.query(`DROP TABLE "property-types"`);
    await queryRunner.query(`DROP TABLE "property-categories"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "user_types"`);
  }
}

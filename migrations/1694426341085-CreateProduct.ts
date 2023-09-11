import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProduct1694426341085 implements MigrationInterface {
    name = 'CreateProduct1694426341085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" character varying NOT NULL, "title" character varying NOT NULL, "product_type" character varying NOT NULL, "created_date" character varying NOT NULL, "image_url" character varying NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product"`);
    }

}

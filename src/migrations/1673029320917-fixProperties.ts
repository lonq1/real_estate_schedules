import { MigrationInterface, QueryRunner } from "typeorm";

export class fixProperties1673029320917 implements MigrationInterface {
    name = 'fixProperties1673029320917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedules_user_properties" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "schedules_user_properties" ADD "date" date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedules_user_properties" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "schedules_user_properties" ADD "date" TIMESTAMP NOT NULL`);
    }

}

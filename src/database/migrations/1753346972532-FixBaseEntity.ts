import { MigrationInterface, QueryRunner } from "typeorm";

export class FixBaseEntity1753346972532 implements MigrationInterface {
    name = 'FixBaseEntity1753346972532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "station" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "umbrella" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "rentals" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "products" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "rentals" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "umbrella" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "station" DROP COLUMN "deletedAt"`);
    }

}

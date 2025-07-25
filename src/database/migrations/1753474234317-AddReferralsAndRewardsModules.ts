import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReferralsAndRewardsModules1753474234317 implements MigrationInterface {
    name = 'AddReferralsAndRewardsModules1753474234317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."referrals_rewardstage_enum" AS ENUM('none', 'signup', 'action')`);
        await queryRunner.query(`CREATE TABLE "referrals" ("id" SERIAL NOT NULL, "rewardGiven" boolean NOT NULL DEFAULT false, "rewardStage" "public"."referrals_rewardstage_enum" NOT NULL DEFAULT 'none', "signUpIp" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "referrerId" integer, "referredId" integer, "inviteCodeId" integer NOT NULL, CONSTRAINT "UQ_9ec04f0875a558743e08d663e05" UNIQUE ("referrerId", "referredId"), CONSTRAINT "PK_ea9980e34f738b6252817326c08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."walletlogs_assettype_enum" AS ENUM('CATNIP', 'CHURU', 'COUPON')`);
        await queryRunner.query(`CREATE TABLE "walletlogs" ("id" SERIAL NOT NULL, "assetType" "public"."walletlogs_assettype_enum" NOT NULL DEFAULT 'CATNIP', "amount" integer NOT NULL, "action" character varying(32) NOT NULL, "refType" character varying, "refId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "walletId" integer, CONSTRAINT "PK_9022b2bd2b1640699a377183b62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."rewards_rewardtype_enum" AS ENUM('none', 'INVITE', 'INVITED')`);
        await queryRunner.query(`CREATE TABLE "rewards" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "rewardType" "public"."rewards_rewardtype_enum" NOT NULL DEFAULT 'none', "amount" integer NOT NULL DEFAULT '0', "reason" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_16f85992ddef5e9fade3eb2e5b6" UNIQUE ("reason"), CONSTRAINT "PK_3d947441a48debeb9b7366f8b8c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "station" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "umbrella" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "rentals" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "referrals" ADD CONSTRAINT "FK_59de462f9ce130da142e3b5a9f4" FOREIGN KEY ("referrerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "referrals" ADD CONSTRAINT "FK_ad6772c3fcb57375f43114b5cb5" FOREIGN KEY ("referredId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "referrals" ADD CONSTRAINT "FK_2236305a5b7ee7f99c722eed104" FOREIGN KEY ("inviteCodeId") REFERENCES "invite_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "walletlogs" ADD CONSTRAINT "FK_a24d250bcc479fdd686c95e63a5" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rewards" ADD CONSTRAINT "FK_119e21376b9f407077a81c05be2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rewards" DROP CONSTRAINT "FK_119e21376b9f407077a81c05be2"`);
        await queryRunner.query(`ALTER TABLE "walletlogs" DROP CONSTRAINT "FK_a24d250bcc479fdd686c95e63a5"`);
        await queryRunner.query(`ALTER TABLE "referrals" DROP CONSTRAINT "FK_2236305a5b7ee7f99c722eed104"`);
        await queryRunner.query(`ALTER TABLE "referrals" DROP CONSTRAINT "FK_ad6772c3fcb57375f43114b5cb5"`);
        await queryRunner.query(`ALTER TABLE "referrals" DROP CONSTRAINT "FK_59de462f9ce130da142e3b5a9f4"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "products" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "admin" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "rentals" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "umbrella" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "station" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`DROP TABLE "rewards"`);
        await queryRunner.query(`DROP TYPE "public"."rewards_rewardtype_enum"`);
        await queryRunner.query(`DROP TABLE "walletlogs"`);
        await queryRunner.query(`DROP TYPE "public"."walletlogs_assettype_enum"`);
        await queryRunner.query(`DROP TABLE "referrals"`);
        await queryRunner.query(`DROP TYPE "public"."referrals_rewardstage_enum"`);
    }

}

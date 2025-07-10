import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminModule1752081368608 implements MigrationInterface {
    name = 'AddAdminModule1752081368608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."admin_role_enum" AS ENUM('SUPER_ADMIN', 'GENERAL_ADMIN', 'SUPPORT_ADMIN')`);
        await queryRunner.query(`CREATE TABLE "admin" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."admin_role_enum" NOT NULL DEFAULT 'GENERAL_ADMIN', "isActive" boolean NOT NULL DEFAULT true, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer" ("id" SERIAL NOT NULL, "content" text NOT NULL, "adminId" integer, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inquiry" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" text NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "userId" integer, CONSTRAINT "PK_3e226d0994e8bd24252dd65e1b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "type" character varying NOT NULL, "message" character varying NOT NULL, "isRead" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "adminId" integer NOT NULL, "ipAddress" character varying NOT NULL, "userAgent" character varying NOT NULL, "action" character varying NOT NULL, "loggedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_42b80ec4239a2d6ee856b340db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_5469a8e1b34c1f96499833055b1" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inquiry" ADD CONSTRAINT "FK_7806c6fea3e0ff475bb422ba0c0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inquiry" DROP CONSTRAINT "FK_7806c6fea3e0ff475bb422ba0c0"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_5469a8e1b34c1f96499833055b1"`);
        await queryRunner.query(`DROP TABLE "admin_log"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "inquiry"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP TABLE "admin"`);
        await queryRunner.query(`DROP TYPE "public"."admin_role_enum"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInviteModules1753264682869 implements MigrationInterface {
    name = 'AddInviteModules1753264682869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invite_code" ("id" SERIAL NOT NULL, "code" character varying(24) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" integer NOT NULL, CONSTRAINT "UQ_d3b40184c2e31f1c26f9424ac18" UNIQUE ("code"), CONSTRAINT "UQ_d3b40184c2e31f1c26f9424ac18" UNIQUE ("code"), CONSTRAINT "PK_a8940979efb1a84ca3470a09c85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d3b40184c2e31f1c26f9424ac1" ON "invite_code" ("code") `);
        await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "invite_code" ADD CONSTRAINT "FK_38adef341bd6cb710eb358476a9" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invite_code" DROP CONSTRAINT "FK_38adef341bd6cb710eb358476a9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d3b40184c2e31f1c26f9424ac1"`);
        await queryRunner.query(`DROP TABLE "invite_code"`);
    }

}

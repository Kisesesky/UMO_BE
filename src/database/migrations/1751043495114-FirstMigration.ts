import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1751043495114 implements MigrationInterface {
    name = 'FirstMigration1751043495114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "station" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "address" character varying NOT NULL, "latitude" numeric(10,7) NOT NULL, "longitude" numeric(10,7) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "description" character varying, CONSTRAINT "PK_cad1b3e7182ef8df1057b82f6aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "umbrella" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'AVAILABLE', "isLost" boolean NOT NULL DEFAULT false, "rentalFeePerHour" numeric(10,2) NOT NULL, "price" numeric(10,2) NOT NULL, "stationId" integer, CONSTRAINT "PK_f0bdaff381a9a91bdda3fde439a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rental" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "rentalStart" TIMESTAMP NOT NULL DEFAULT now(), "rentalEnd" TIMESTAMP, "status" character varying NOT NULL DEFAULT 'PENDING', "totalFee" numeric(10,2), "rentalStationId" integer, "returnStationId" integer, "userId" integer, "umbrellaId" integer, CONSTRAINT "PK_a20fc571eb61d5a30d8c16d51e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wallet" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "balance" numeric(10,2) NOT NULL DEFAULT '0', "userId" integer NOT NULL, CONSTRAINT "UQ_35472b1fe48b6330cd349709564" UNIQUE ("userId"), CONSTRAINT "REL_35472b1fe48b6330cd34970956" UNIQUE ("userId"), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'USER', "status" character varying NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "umbrella" ADD CONSTRAINT "FK_70af0264028ba616136d07ce057" FOREIGN KEY ("stationId") REFERENCES "station"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rental" ADD CONSTRAINT "FK_5c91d10c5ee7afddcb2dbbfbbd0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rental" ADD CONSTRAINT "FK_302784c1726eef5bbfb9187495d" FOREIGN KEY ("umbrellaId") REFERENCES "umbrella"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`);
        await queryRunner.query(`ALTER TABLE "rental" DROP CONSTRAINT "FK_302784c1726eef5bbfb9187495d"`);
        await queryRunner.query(`ALTER TABLE "rental" DROP CONSTRAINT "FK_5c91d10c5ee7afddcb2dbbfbbd0"`);
        await queryRunner.query(`ALTER TABLE "umbrella" DROP CONSTRAINT "FK_70af0264028ba616136d07ce057"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
        await queryRunner.query(`DROP TABLE "rental"`);
        await queryRunner.query(`DROP TABLE "umbrella"`);
        await queryRunner.query(`DROP TABLE "station"`);
    }

}

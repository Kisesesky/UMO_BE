import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRentalsModules1751358719633 implements MigrationInterface {
    name = 'CreateRentalsModules1751358719633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rentals" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "rental_start" TIMESTAMP NOT NULL, "rental_end" TIMESTAMP, "status" character varying NOT NULL DEFAULT 'PENDING', "rental_station_id" integer NOT NULL, "return_station_id" integer, "total_fee" integer NOT NULL DEFAULT '0', "deposit_amount" integer NOT NULL DEFAULT '0', "user_id" integer, "umbrella_id" integer, CONSTRAINT "PK_2b10d04c95a8bfe85b506ba52ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rentals" ADD CONSTRAINT "FK_b13ac8580bd6a011f47a476fbad" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rentals" ADD CONSTRAINT "FK_f6b146fee1b349d87da727b72ae" FOREIGN KEY ("umbrella_id") REFERENCES "umbrella"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rentals" DROP CONSTRAINT "FK_f6b146fee1b349d87da727b72ae"`);
        await queryRunner.query(`ALTER TABLE "rentals" DROP CONSTRAINT "FK_b13ac8580bd6a011f47a476fbad"`);
        await queryRunner.query(`DROP TABLE "rentals"`);
    }

}

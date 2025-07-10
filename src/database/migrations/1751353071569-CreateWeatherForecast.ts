import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWeatherForecast1751353071569 implements MigrationInterface {
    name = 'CreateWeatherForecast1751353071569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "daily_weather_forecast" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "forecast_date" date NOT NULL, "nx" integer NOT NULL, "ny" integer NOT NULL, "min_temperature" double precision, "max_temperature" double precision, "am_precipitation_prob" integer, "pm_precipitation_prob" integer, "am_weather_condition" character varying(50), "pm_weather_condition" character varying(50), "base_date" date NOT NULL, "base_time" character varying(10) NOT NULL, "reg_id" character varying(20), CONSTRAINT "PK_427a6c94cdb60a5084f39242efc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9ae1aa7c760abb29570d4a8611" ON "daily_weather_forecast" ("forecast_date", "nx", "ny") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9ae1aa7c760abb29570d4a8611"`);
        await queryRunner.query(`DROP TABLE "daily_weather_forecast"`);
    }

}

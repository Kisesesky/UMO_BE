import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigrations1752472959127 implements MigrationInterface {
    name = 'FirstMigrations1752472959127'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "station" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "address" character varying NOT NULL, "latitude" numeric(10,7) NOT NULL, "longitude" numeric(10,7) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "description" character varying, CONSTRAINT "PK_cad1b3e7182ef8df1057b82f6aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "umbrella" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'AVAILABLE', "isLost" boolean NOT NULL DEFAULT false, "rentalFeePerHour" numeric(10,2) NOT NULL, "price" numeric(10,2) NOT NULL, "stationId" integer, CONSTRAINT "PK_f0bdaff381a9a91bdda3fde439a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rentals" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "rental_start" TIMESTAMP NOT NULL, "rental_end" TIMESTAMP, "status" character varying NOT NULL DEFAULT 'PENDING', "rental_station_id" integer NOT NULL, "return_station_id" integer, "total_fee" integer NOT NULL DEFAULT '0', "deposit_amount" integer NOT NULL DEFAULT '0', "user_id" integer, "umbrella_id" integer, CONSTRAINT "PK_2b10d04c95a8bfe85b506ba52ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wallets" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "churu_balance" integer NOT NULL DEFAULT '0', "catnip_balance" integer NOT NULL DEFAULT '0', "user_id" integer NOT NULL, CONSTRAINT "UQ_92558c08091598f7a4439586cda" UNIQUE ("user_id"), CONSTRAINT "REL_92558c08091598f7a4439586cd" UNIQUE ("user_id"), CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying, "password" character varying, "role" character varying NOT NULL DEFAULT 'USER', "status" character varying NOT NULL DEFAULT 'ACTIVE', "socialId" character varying, "provider" character varying NOT NULL DEFAULT 'EMAIL', "profileImage" character varying, "agreedTerms" boolean NOT NULL DEFAULT false, "agreedPrivacy" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_9bd2fe7a8e694dedc4ec2f666fe" UNIQUE ("socialId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "daily_weather_forecast" ("id" SERIAL NOT NULL, "nx" integer NOT NULL, "ny" integer NOT NULL, "baseDate" date NOT NULL, "baseTime" character varying(10) NOT NULL, "forecast_date" date NOT NULL, "min_temperature" double precision, "max_temperature" double precision, "am_precipitation_prob" integer, "pm_precipitation_prob" integer, "am_weather_condition" character varying(50), "pm_weather_condition" character varying(50), "reg_id" character varying(20), CONSTRAINT "PK_427a6c94cdb60a5084f39242efc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9ae1aa7c760abb29570d4a8611" ON "daily_weather_forecast" ("forecast_date", "nx", "ny") `);
        await queryRunner.query(`CREATE TABLE "current_weather" ("id" SERIAL NOT NULL, "nx" integer NOT NULL, "ny" integer NOT NULL, "baseDate" date NOT NULL, "baseTime" character varying(10) NOT NULL, "temperature" double precision NOT NULL, "humidity" integer NOT NULL, "rainType" integer NOT NULL, "windSpeed" double precision NOT NULL, "windDirection" integer NOT NULL, "observedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_30f7aa5174e2f82f53d4da236ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c6c2b9bebf52a8c9b9f9db87e3" ON "current_weather" ("nx", "ny", "observedAt") `);
        await queryRunner.query(`CREATE TYPE "public"."admin_role_enum" AS ENUM('SUPER_ADMIN', 'GENERAL_ADMIN', 'SUPPORT_ADMIN')`);
        await queryRunner.query(`CREATE TABLE "admin" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."admin_role_enum" NOT NULL DEFAULT 'GENERAL_ADMIN', "isActive" boolean NOT NULL DEFAULT true, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer" ("id" SERIAL NOT NULL, "content" text NOT NULL, "adminId" integer, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inquiry" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" text NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "userId" integer, CONSTRAINT "PK_3e226d0994e8bd24252dd65e1b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "short_term_forecast" ("id" SERIAL NOT NULL, "nx" integer NOT NULL, "ny" integer NOT NULL, "baseDate" date NOT NULL, "baseTime" character varying(10) NOT NULL, "fcst_date" date NOT NULL, "fcst_time" character varying(10) NOT NULL, "temperature" double precision, "humidity" integer, "rain_type" integer, "rain_amount" double precision, "wind_speed" double precision, "wind_direction" integer, CONSTRAINT "PK_7f993164d71aadc07252c0c417e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a8f625e8bde6fd9f2563ca90d9" ON "short_term_forecast" ("fcst_date", "fcst_time", "nx", "ny") `);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "description" text, "price" integer NOT NULL, "product_type" character varying(20) NOT NULL, "currency_type" character varying(20) NOT NULL, "duration_days" integer, "image_url" character varying(255), "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "product_id" integer NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "status" character varying(20) NOT NULL, CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "product_id" integer NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'PENDING', "total_amount" integer NOT NULL, "completed_at" TIMESTAMP, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "type" character varying NOT NULL, "message" character varying NOT NULL, "isRead" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "adminId" integer NOT NULL, "ipAddress" character varying NOT NULL, "userAgent" character varying NOT NULL, "action" character varying NOT NULL, "loggedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_42b80ec4239a2d6ee856b340db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "umbrella" ADD CONSTRAINT "FK_70af0264028ba616136d07ce057" FOREIGN KEY ("stationId") REFERENCES "station"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rentals" ADD CONSTRAINT "FK_b13ac8580bd6a011f47a476fbad" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rentals" ADD CONSTRAINT "FK_f6b146fee1b349d87da727b72ae" FOREIGN KEY ("umbrella_id") REFERENCES "umbrella"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD CONSTRAINT "FK_92558c08091598f7a4439586cda" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_5469a8e1b34c1f96499833055b1" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inquiry" ADD CONSTRAINT "FK_7806c6fea3e0ff475bb422ba0c0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_b7f78362e96be1edd6203e047f6" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_ac832121b6c331b084ecc4121fd" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_ac832121b6c331b084ecc4121fd"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_b7f78362e96be1edd6203e047f6"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1"`);
        await queryRunner.query(`ALTER TABLE "inquiry" DROP CONSTRAINT "FK_7806c6fea3e0ff475bb422ba0c0"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_5469a8e1b34c1f96499833055b1"`);
        await queryRunner.query(`ALTER TABLE "wallets" DROP CONSTRAINT "FK_92558c08091598f7a4439586cda"`);
        await queryRunner.query(`ALTER TABLE "rentals" DROP CONSTRAINT "FK_f6b146fee1b349d87da727b72ae"`);
        await queryRunner.query(`ALTER TABLE "rentals" DROP CONSTRAINT "FK_b13ac8580bd6a011f47a476fbad"`);
        await queryRunner.query(`ALTER TABLE "umbrella" DROP CONSTRAINT "FK_70af0264028ba616136d07ce057"`);
        await queryRunner.query(`DROP TABLE "admin_log"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a8f625e8bde6fd9f2563ca90d9"`);
        await queryRunner.query(`DROP TABLE "short_term_forecast"`);
        await queryRunner.query(`DROP TABLE "inquiry"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP TABLE "admin"`);
        await queryRunner.query(`DROP TYPE "public"."admin_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6c2b9bebf52a8c9b9f9db87e3"`);
        await queryRunner.query(`DROP TABLE "current_weather"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9ae1aa7c760abb29570d4a8611"`);
        await queryRunner.query(`DROP TABLE "daily_weather_forecast"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "wallets"`);
        await queryRunner.query(`DROP TABLE "rentals"`);
        await queryRunner.query(`DROP TABLE "umbrella"`);
        await queryRunner.query(`DROP TABLE "station"`);
    }

}

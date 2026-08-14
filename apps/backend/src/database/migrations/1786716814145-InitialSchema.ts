import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1786716814145 implements MigrationInterface {
    name = 'InitialSchema1786716814145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."adoption_requests_state_enum" AS ENUM('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO')`);
        await queryRunner.query(`CREATE TYPE "public"."adoption_requests_status_enum" AS ENUM('PENDING', 'IN_ANALYSIS', 'APPROVED', 'REJECTED', 'CANCELED')`);
        await queryRunner.query(`CREATE TABLE "adoption_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "animal_id" uuid NOT NULL, "applicant_name" character varying NOT NULL, "applicant_email" character varying NOT NULL, "applicant_phone" character varying NOT NULL, "state" "public"."adoption_requests_state_enum" NOT NULL, "city" character varying NOT NULL, "message" text NOT NULL, "status" "public"."adoption_requests_status_enum" NOT NULL, CONSTRAINT "PK_b62df67d1dc523ee76efc9793b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."animals_species_enum" AS ENUM('DOG', 'CAT', 'BIRD', 'RABBIT', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."animals_sex_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`CREATE TYPE "public"."animals_size_enum" AS ENUM('SMALL', 'MEDIUM', 'LARGE')`);
        await queryRunner.query(`CREATE TYPE "public"."animals_state_enum" AS ENUM('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO')`);
        await queryRunner.query(`CREATE TYPE "public"."animals_status_enum" AS ENUM('AVAILABLE', 'ADOPTED')`);
        await queryRunner.query(`CREATE TABLE "animals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by_user_id" uuid NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "species" "public"."animals_species_enum" NOT NULL, "breed" character varying NOT NULL, "sex" "public"."animals_sex_enum" NOT NULL, "size" "public"."animals_size_enum" NOT NULL, "color" character varying NOT NULL, "state" "public"."animals_state_enum" NOT NULL, "city" character varying NOT NULL, "age_in_months" integer NOT NULL, "vaccinated" boolean NOT NULL, "neutered" boolean NOT NULL, "status" "public"."animals_status_enum" NOT NULL, CONSTRAINT "PK_6154c334bbb19186788468bce5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "animal_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "animal_id" uuid NOT NULL, "url" character varying NOT NULL, "is_primary" boolean NOT NULL, CONSTRAINT "PK_401733200e1009acda47938bbc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "adoption_requests" ADD CONSTRAINT "FK_9738e0e44f3c2f6445e986fccfe" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "animals" ADD CONSTRAINT "FK_66f0b544932f22f1d04214e61d4" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "animal_images" ADD CONSTRAINT "FK_dfb5d6007baa2b465465160ed5b" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animal_images" DROP CONSTRAINT "FK_dfb5d6007baa2b465465160ed5b"`);
        await queryRunner.query(`ALTER TABLE "animals" DROP CONSTRAINT "FK_66f0b544932f22f1d04214e61d4"`);
        await queryRunner.query(`ALTER TABLE "adoption_requests" DROP CONSTRAINT "FK_9738e0e44f3c2f6445e986fccfe"`);
        await queryRunner.query(`DROP TABLE "animal_images"`);
        await queryRunner.query(`DROP TABLE "animals"`);
        await queryRunner.query(`DROP TYPE "public"."animals_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."animals_state_enum"`);
        await queryRunner.query(`DROP TYPE "public"."animals_size_enum"`);
        await queryRunner.query(`DROP TYPE "public"."animals_sex_enum"`);
        await queryRunner.query(`DROP TYPE "public"."animals_species_enum"`);
        await queryRunner.query(`DROP TABLE "adoption_requests"`);
        await queryRunner.query(`DROP TYPE "public"."adoption_requests_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."adoption_requests_state_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}

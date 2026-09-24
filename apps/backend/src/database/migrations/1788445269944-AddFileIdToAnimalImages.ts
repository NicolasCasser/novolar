import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFileIdToAnimalImages1788445269944 implements MigrationInterface {
  name = 'AddFileIdToAnimalImages1788445269944';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "animal_images" DROP COLUMN "url"`);
    await queryRunner.query(
      `ALTER TABLE "animal_images" ADD "file_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "animal_images" ADD CONSTRAINT "FK_6b42a68243a8ef1e5dbbaafb336" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "animal_images" DROP CONSTRAINT "FK_6b42a68243a8ef1e5dbbaafb336"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animal_images" DROP COLUMN "file_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "animal_images" ADD "url" character varying NOT NULL`,
    );
  }
}

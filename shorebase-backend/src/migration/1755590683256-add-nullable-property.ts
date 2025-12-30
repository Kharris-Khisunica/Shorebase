import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNullableProperty1755590683256 implements MigrationInterface {
    name = 'AddNullableProperty1755590683256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activity\` CHANGE \`actualDescription\` \`actualDescription\` varchar(1023) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activity\` CHANGE \`actualDescription\` \`actualDescription\` varchar(1023) NOT NULL`);
    }

}

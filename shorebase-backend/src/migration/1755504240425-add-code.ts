import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCode1755504240425 implements MigrationInterface {
    name = 'AddCode1755504240425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shorebase_service\` DROP FOREIGN KEY \`FK_a23933f30d8338cce10b6ef3e37\``);
        await queryRunner.query(`ALTER TABLE \`invoice\` ADD \`code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`performa_invoice\` ADD \`code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` ADD \`code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD \`code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` ADD \`code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`shorebase_service\` ADD CONSTRAINT \`FK_a23933f30d8338cce10b6ef3e37\` FOREIGN KEY (\`uomCode\`) REFERENCES \`uom\`(\`code\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shorebase_service\` DROP FOREIGN KEY \`FK_a23933f30d8338cce10b6ef3e37\``);
        await queryRunner.query(`ALTER TABLE \`timesheet\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`activity\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`performa_invoice\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`invoice\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`shorebase_service\` ADD CONSTRAINT \`FK_a23933f30d8338cce10b6ef3e37\` FOREIGN KEY (\`uomCode\`) REFERENCES \`uom\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

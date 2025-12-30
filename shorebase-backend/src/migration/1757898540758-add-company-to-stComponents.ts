import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompanyToStComponents1757898540758 implements MigrationInterface {
    name = 'AddCompanyToStComponents1757898540758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` DROP COLUMN \`periodeEndDate\``);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` DROP COLUMN \`periodeStartDate\``);
        await queryRunner.query(`ALTER TABLE \`st_component\` ADD \`aggAmount\` decimal(22,4) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`st_component\` ADD \`remark\` varchar(1023) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`st_component\` ADD \`companyId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` ADD \`periodStartDate\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` ADD \`periodEndDate\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` ADD \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` ADD \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`st_component\` ADD CONSTRAINT \`FK_9c4e31681564bc71ceeeaaf5c2e\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`st_component\` DROP FOREIGN KEY \`FK_9c4e31681564bc71ceeeaaf5c2e\``);
        await queryRunner.query(`ALTER TABLE \`timesheet\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` DROP COLUMN \`periodEndDate\``);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` DROP COLUMN \`periodStartDate\``);
        await queryRunner.query(`ALTER TABLE \`st_component\` DROP COLUMN \`companyId\``);
        await queryRunner.query(`ALTER TABLE \`st_component\` DROP COLUMN \`remark\``);
        await queryRunner.query(`ALTER TABLE \`st_component\` DROP COLUMN \`aggAmount\``);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` ADD \`periodeStartDate\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` ADD \`periodeEndDate\` date NOT NULL`);
    }

}

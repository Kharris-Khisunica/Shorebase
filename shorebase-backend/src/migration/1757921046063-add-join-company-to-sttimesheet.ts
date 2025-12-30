import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJoinCompanyToSttimesheet1757921046063 implements MigrationInterface {
    name = 'AddJoinCompanyToSttimesheet1757921046063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`st_timesheet\` ADD \`timesheetId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`st_timesheet\` ADD UNIQUE INDEX \`IDX_7dbf8b945e90bd488fc0632e55\` (\`timesheetId\`)`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` CHANGE \`createdAt\` \`createdAt\` datetime NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_7dbf8b945e90bd488fc0632e55\` ON \`st_timesheet\` (\`timesheetId\`)`);
        await queryRunner.query(`ALTER TABLE \`st_timesheet\` ADD CONSTRAINT \`FK_7dbf8b945e90bd488fc0632e559\` FOREIGN KEY (\`timesheetId\`) REFERENCES \`timesheet\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`st_timesheet\` DROP FOREIGN KEY \`FK_7dbf8b945e90bd488fc0632e559\``);
        await queryRunner.query(`DROP INDEX \`REL_7dbf8b945e90bd488fc0632e55\` ON \`st_timesheet\``);
        await queryRunner.query(`ALTER TABLE \`timesheet\` CHANGE \`createdAt\` \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`st_timesheet\` DROP INDEX \`IDX_7dbf8b945e90bd488fc0632e55\``);
        await queryRunner.query(`ALTER TABLE \`st_timesheet\` DROP COLUMN \`timesheetId\``);
    }

}

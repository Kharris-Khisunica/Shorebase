import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeSummaryTimesheetFK1756196076153 implements MigrationInterface {
    name = 'ChangeSummaryTimesheetFK1756196076153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` DROP FOREIGN KEY \`FK_7e039b0bf55489b9f9f6a21ffa9\``);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` CHANGE \`shorebaseServiceId\` \`companyId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` ADD CONSTRAINT \`FK_1289c1e762710fe69d86786cc54\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` DROP FOREIGN KEY \`FK_1289c1e762710fe69d86786cc54\``);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` CHANGE \`companyId\` \`shorebaseServiceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` ADD CONSTRAINT \`FK_7e039b0bf55489b9f9f6a21ffa9\` FOREIGN KEY (\`shorebaseServiceId\`) REFERENCES \`shorebase_service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class MoveRemarkToActualActivity1765698295035 implements MigrationInterface {
    name = 'MoveRemarkToActualActivity1765698295035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`actual_activity_jetty\` CHANGE \`actualStartDatetime\` \`actualStartedAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`actual_activity_mh\` DROP COLUMN \`actualRemark\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity\` ADD \`remark\` varchar(1023) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`actual_activity\` DROP COLUMN \`remark\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity_mh\` ADD \`actualRemark\` varchar(1023) NULL`);
        await queryRunner.query(`ALTER TABLE \`actual_activity_jetty\` CHANGE \`actualStartedAt\` \`actualStartDatetime\` datetime NULL`);
    }

}

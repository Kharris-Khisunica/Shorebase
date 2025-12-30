import { MigrationInterface, QueryRunner } from "typeorm";

export class JobTitlePositionToJobPosition1755488402111 implements MigrationInterface {
    name = 'JobTitlePositionToJobPosition1755488402111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_position\` DROP FOREIGN KEY \`FK_a181d19410343624fa0d3b268fb\``);
        await queryRunner.query(`ALTER TABLE \`user_position\` CHANGE \`jobTitlePositionId\` \`jobPositionId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_position\` ADD CONSTRAINT \`FK_32c8a57af4be97840956587b118\` FOREIGN KEY (\`jobPositionId\`) REFERENCES \`job_position\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_position\` DROP FOREIGN KEY \`FK_32c8a57af4be97840956587b118\``);
        await queryRunner.query(`ALTER TABLE \`user_position\` CHANGE \`jobPositionId\` \`jobTitlePositionId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_position\` ADD CONSTRAINT \`FK_a181d19410343624fa0d3b268fb\` FOREIGN KEY (\`jobTitlePositionId\`) REFERENCES \`job_position\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

}

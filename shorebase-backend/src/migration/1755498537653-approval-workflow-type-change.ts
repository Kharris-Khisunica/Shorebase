import { MigrationInterface, QueryRunner } from "typeorm";

export class ApprovalWorkflowTypeChange1755498537653 implements MigrationInterface {
    name = 'ApprovalWorkflowTypeChange1755498537653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`approval_workflow_stage\` ADD \`userPositionId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`approval_workflow\` ADD \`typeCode\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`approval_workflow_stage\` ADD CONSTRAINT \`FK_9691f8378e855fc9590c96cbc93\` FOREIGN KEY (\`userPositionId\`) REFERENCES \`user_position\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`approval_workflow\` ADD CONSTRAINT \`FK_c07ddf370933572c2e35ff75dd8\` FOREIGN KEY (\`typeCode\`) REFERENCES \`approval_type\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`approval_workflow\` DROP FOREIGN KEY \`FK_c07ddf370933572c2e35ff75dd8\``);
        await queryRunner.query(`ALTER TABLE \`approval_workflow_stage\` DROP FOREIGN KEY \`FK_9691f8378e855fc9590c96cbc93\``);
        await queryRunner.query(`ALTER TABLE \`approval_workflow\` DROP COLUMN \`typeCode\``);
        await queryRunner.query(`ALTER TABLE \`approval_workflow_stage\` DROP COLUMN \`userPositionId\``);
    }

}

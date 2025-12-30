import { MigrationInterface, QueryRunner } from "typeorm";

export class DropPlanActivityId1755837291559 implements MigrationInterface {
    name = 'DropPlanActivityId1755837291559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activity\` DROP FOREIGN KEY \`FK_abc20e5ae14f726e700a7263aad\``);
        await queryRunner.query(`ALTER TABLE \`activity\` DROP COLUMN \`plannedActivityId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activity\` ADD \`plannedActivityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD CONSTRAINT \`FK_abc20e5ae14f726e700a7263aad\` FOREIGN KEY (\`plannedActivityId\`) REFERENCES \`activity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

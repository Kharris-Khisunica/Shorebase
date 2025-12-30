import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeServiceToShorebaseService1755761714935 implements MigrationInterface {
    name = 'ChangeServiceToShorebaseService1755761714935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contract_service\` DROP FOREIGN KEY \`FK_7dec02d521c575cf1f55df3b932\``);
        await queryRunner.query(`ALTER TABLE \`contract_service\` CHANGE \`serviceId\` \`shorebaseServiceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`contract_service\` ADD CONSTRAINT \`FK_2c01de365ab7f58309451d7beca\` FOREIGN KEY (\`shorebaseServiceId\`) REFERENCES \`shorebase_service\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contract_service\` DROP FOREIGN KEY \`FK_2c01de365ab7f58309451d7beca\``);
        await queryRunner.query(`ALTER TABLE \`contract_service\` CHANGE \`shorebaseServiceId\` \`serviceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`contract_service\` ADD CONSTRAINT \`FK_7dec02d521c575cf1f55df3b932\` FOREIGN KEY (\`serviceId\`) REFERENCES \`shorebase_service\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

}

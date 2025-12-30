import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUomTableName1754990679633 implements MigrationInterface {
    name = 'ChangeUomTableName1754990679633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`st_component\` DROP FOREIGN KEY \`FK_404a2583f02381f074b3c03fc3b\``);
        await queryRunner.query(`ALTER TABLE \`activity\` DROP FOREIGN KEY \`FK_a3be35ce844d95f1a4ec75b3852\``);
        await queryRunner.query(`ALTER TABLE \`shorebase_service\` DROP FOREIGN KEY \`FK_a23933f30d8338cce10b6ef3e37\``);
        await queryRunner.query(`ALTER TABLE \`contract_service\` DROP FOREIGN KEY \`FK_f4005961d8229d33d53d7b559a2\``);
        await queryRunner.query(`ALTER TABLE \`timesheet\` DROP FOREIGN KEY \`FK_496744bcf637a12e544804e2d88\``);
        await queryRunner.query(`DROP TABLE \`uo_m\``);
        await queryRunner.query(`CREATE TABLE \`uom\` (\`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`code\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`st_component\` ADD CONSTRAINT \`FK_404a2583f02381f074b3c03fc3b\` FOREIGN KEY (\`uomCode\`) REFERENCES \`uom\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD CONSTRAINT \`FK_a3be35ce844d95f1a4ec75b3852\` FOREIGN KEY (\`uomCode\`) REFERENCES \`uom\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shorebase_service\` ADD CONSTRAINT \`FK_a23933f30d8338cce10b6ef3e37\` FOREIGN KEY (\`uomCode\`) REFERENCES \`uom\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contract_service\` ADD CONSTRAINT \`FK_f4005961d8229d33d53d7b559a2\` FOREIGN KEY (\`uomCode\`) REFERENCES \`uom\`(\`code\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` ADD CONSTRAINT \`FK_496744bcf637a12e544804e2d88\` FOREIGN KEY (\`uomCode\`) REFERENCES \`uom\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`timesheet\` DROP FOREIGN KEY \`FK_496744bcf637a12e544804e2d88\``);
        await queryRunner.query(`ALTER TABLE \`contract_service\` DROP FOREIGN KEY \`FK_f4005961d8229d33d53d7b559a2\``);
        await queryRunner.query(`ALTER TABLE \`shorebase_service\` DROP FOREIGN KEY \`FK_a23933f30d8338cce10b6ef3e37\``);
        await queryRunner.query(`ALTER TABLE \`activity\` DROP FOREIGN KEY \`FK_a3be35ce844d95f1a4ec75b3852\``);
        await queryRunner.query(`ALTER TABLE \`st_component\` DROP FOREIGN KEY \`FK_404a2583f02381f074b3c03fc3b\``);
        await queryRunner.query(`CREATE TABLE \`uo_m\` (\`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`code\`)) ENGINE=InnoDB`);
        await queryRunner.query(`DROP TABLE \`uom\``);
        await queryRunner.query(`ALTER TABLE \`timesheet\` ADD CONSTRAINT \`FK_496744bcf637a12e544804e2d88\` FOREIGN KEY (\`uomCode\`) REFERENCES \`uo_m\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contract_service\` ADD CONSTRAINT \`FK_f4005961d8229d33d53d7b559a2\` FOREIGN KEY (\`uomCode\`) REFERENCES \`uo_m\`(\`code\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`shorebase_service\` ADD CONSTRAINT \`FK_a23933f30d8338cce10b6ef3e37\` FOREIGN KEY (\`uomCode\`) REFERENCES \`uo_m\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD CONSTRAINT \`FK_a3be35ce844d95f1a4ec75b3852\` FOREIGN KEY (\`uomCode\`) REFERENCES \`uo_m\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`st_component\` ADD CONSTRAINT \`FK_404a2583f02381f074b3c03fc3b\` FOREIGN KEY (\`uomCode\`) REFERENCES \`uo_m\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

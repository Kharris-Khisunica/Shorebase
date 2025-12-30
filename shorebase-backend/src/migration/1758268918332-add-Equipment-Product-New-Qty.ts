import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEquipmentProductNewQty1758268918332 implements MigrationInterface {
    name = 'AddEquipmentProductNewQty1758268918332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_7dbf8b945e90bd488fc0632e55\` ON \`st_timesheet\``);
        await queryRunner.query(`CREATE TABLE \`shorebase_service_product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`uomCode\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`equipment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`activity\` DROP COLUMN \`actualendedAt\``);
        await queryRunner.query(`ALTER TABLE \`contract\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`timesheet\` ADD \`description\` varchar(1023) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD \`planProductQty\` double NULL`);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD \`actualProductQty\` double NULL`);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD \`actualEndedAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD \`shorebaseServiceProductId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD \`equipmentId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` CHANGE \`createdAt\` \`createdAt\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_product\` ADD CONSTRAINT \`FK_3e1c6509e4ceadd87ddce866107\` FOREIGN KEY (\`uomCode\`) REFERENCES \`uom\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD CONSTRAINT \`FK_5f03da2b66db60923e870e0b449\` FOREIGN KEY (\`shorebaseServiceProductId\`) REFERENCES \`shorebase_service_product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD CONSTRAINT \`FK_58f2437efcbf6f1955951a2faa1\` FOREIGN KEY (\`equipmentId\`) REFERENCES \`equipment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activity\` DROP FOREIGN KEY \`FK_58f2437efcbf6f1955951a2faa1\``);
        await queryRunner.query(`ALTER TABLE \`activity\` DROP FOREIGN KEY \`FK_5f03da2b66db60923e870e0b449\``);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_product\` DROP FOREIGN KEY \`FK_3e1c6509e4ceadd87ddce866107\``);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` CHANGE \`createdAt\` \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`activity\` DROP COLUMN \`equipmentId\``);
        await queryRunner.query(`ALTER TABLE \`activity\` DROP COLUMN \`shorebaseServiceProductId\``);
        await queryRunner.query(`ALTER TABLE \`activity\` DROP COLUMN \`actualEndedAt\``);
        await queryRunner.query(`ALTER TABLE \`activity\` DROP COLUMN \`actualProductQty\``);
        await queryRunner.query(`ALTER TABLE \`activity\` DROP COLUMN \`planProductQty\``);
        await queryRunner.query(`ALTER TABLE \`timesheet\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`contract\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD \`actualendedAt\` datetime NULL`);
        await queryRunner.query(`DROP TABLE \`equipment\``);
        await queryRunner.query(`DROP TABLE \`shorebase_service_product\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_7dbf8b945e90bd488fc0632e55\` ON \`st_timesheet\` (\`timesheetId\`)`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class SplitActivityAddSpecialization1764225453579 implements MigrationInterface {
    name = 'SplitActivityAddSpecialization1764225453579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`plan_activity_mh\` (\`id\` int NOT NULL AUTO_INCREMENT, \`planStartedAt\` date NULL, \`planDescription\` varchar(1023) NULL, \`planProductQty\` int NULL, \`planRemark\` varchar(1023) NULL, \`planActivityId\` int NULL, \`planProductId\` int NULL, UNIQUE INDEX \`REL_21a1f2a7b67f54aca004ec57b1\` (\`planActivityId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`plan_activity_meal\` (\`id\` int NOT NULL AUTO_INCREMENT, \`planStartDate\` date NULL, \`planEndDate\` date NULL, \`planPeopleCount\` int NULL, \`planBreakfast\` tinyint NOT NULL DEFAULT 0, \`planLunch\` tinyint NOT NULL DEFAULT 0, \`planDinner\` tinyint NOT NULL DEFAULT 0, \`planActivityId\` int NULL, UNIQUE INDEX \`REL_64f3c3b1c3cc479388a288ddc5\` (\`planActivityId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`actual_activity_jetty\` (\`id\` int NOT NULL AUTO_INCREMENT, \`actualStartDatetime\` datetime NULL, \`actualEndDatetime\` datetime NULL, \`actualJenisLayanan\` varchar(255) NULL, \`actualActivityId\` int NULL, \`shipId\` int NULL, UNIQUE INDEX \`REL_72f00e93a254ef078222910181\` (\`actualActivityId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ship\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`plan_activity_jetty\` (\`id\` int NOT NULL AUTO_INCREMENT, \`planStartDatetime\` datetime NULL, \`planJenisLayanan\` varchar(255) NULL, \`planActivityId\` int NULL, \`shipId\` int NULL, UNIQUE INDEX \`REL_a1a9253e8beb0477b65bc11f82\` (\`planActivityId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`actual_activity_accomodation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`actualCheckIn\` datetime NULL, \`actualCheckOut\` datetime NULL, \`actualRoomCount\` int NULL, \`actualActivityId\` int NULL, \`actualRoomTypeId\` int NULL, UNIQUE INDEX \`REL_f172d7988bcd4eeb81c292f9c7\` (\`actualActivityId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`room_type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`plan_activity_accomodation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`planCheckIn\` datetime NULL, \`planCheckOut\` datetime NULL, \`planRoomCount\` int NULL, \`planActivityId\` int NULL, \`planRoomTypeId\` int NULL, UNIQUE INDEX \`REL_54cbef4d958b29416d8f189872\` (\`planActivityId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`plan_activity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`description\` varchar(255) NOT NULL, \`code\` varchar(255) NULL, \`timesheetTypeCode\` varchar(255) NULL, \`contractServiceId\` int NULL, \`subContractorId\` int NULL, \`companyId\` int NULL, \`shorebaseServiceId\` int NULL, \`uomCode\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`actual_activity_meal\` (\`id\` int NOT NULL AUTO_INCREMENT, \`actualStartDate\` date NULL, \`actualEndDate\` date NULL, \`actualPeopleCount\` int NULL, \`actualBreakfast\` tinyint NOT NULL DEFAULT 0, \`actualLunch\` tinyint NOT NULL DEFAULT 0, \`actualDinner\` tinyint NOT NULL DEFAULT 0, \`actualActivityId\` int NULL, UNIQUE INDEX \`REL_6acb05f521955accf3394ea72d\` (\`actualActivityId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`actual_activity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`description\` varchar(255) NOT NULL, \`code\` varchar(255) NULL, \`planActivityId\` int NULL, \`timesheetTypeCode\` varchar(255) NULL, \`contractServiceId\` int NULL, \`subContractorId\` int NULL, \`companyId\` int NULL, \`shorebaseServiceId\` int NULL, \`uomCode\` varchar(255) NULL, UNIQUE INDEX \`REL_a3f5cd82d02413f218c9fc6f47\` (\`planActivityId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`actual_activity_mh\` (\`id\` int NOT NULL AUTO_INCREMENT, \`actualAmount\` double NULL, \`actualStartedAt\` datetime NULL, \`actualEndedAt\` datetime NULL, \`actualDescription\` varchar(1023) NULL, \`actualProductQty\` int NULL, \`actualRemark\` varchar(1023) NULL, \`actualActivityId\` int NULL, \`actualProductId\` int NULL, \`equipmentId\` int NULL, UNIQUE INDEX \`REL_fa4de58f1e182bb14b68fd2da1\` (\`actualActivityId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD \`planActivityId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`timesheet_activity\` ADD \`actualActivityId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` CHANGE \`createdAt\` \`createdAt\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`plan_activity_mh\` ADD CONSTRAINT \`FK_21a1f2a7b67f54aca004ec57b1f\` FOREIGN KEY (\`planActivityId\`) REFERENCES \`plan_activity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`plan_activity_mh\` ADD CONSTRAINT \`FK_437118c60c38007c34f6d29381f\` FOREIGN KEY (\`planProductId\`) REFERENCES \`shorebase_service_product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`plan_activity_meal\` ADD CONSTRAINT \`FK_64f3c3b1c3cc479388a288ddc54\` FOREIGN KEY (\`planActivityId\`) REFERENCES \`plan_activity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`actual_activity_jetty\` ADD CONSTRAINT \`FK_72f00e93a254ef0782229101810\` FOREIGN KEY (\`actualActivityId\`) REFERENCES \`actual_activity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`actual_activity_jetty\` ADD CONSTRAINT \`FK_e00076b3aa536f53dcd9ba3e4c3\` FOREIGN KEY (\`shipId\`) REFERENCES \`ship\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`plan_activity_jetty\` ADD CONSTRAINT \`FK_a1a9253e8beb0477b65bc11f82e\` FOREIGN KEY (\`planActivityId\`) REFERENCES \`plan_activity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`plan_activity_jetty\` ADD CONSTRAINT \`FK_ae56b9526693898ae0cdca18f39\` FOREIGN KEY (\`shipId\`) REFERENCES \`ship\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`actual_activity_accomodation\` ADD CONSTRAINT \`FK_f172d7988bcd4eeb81c292f9c70\` FOREIGN KEY (\`actualActivityId\`) REFERENCES \`actual_activity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`actual_activity_accomodation\` ADD CONSTRAINT \`FK_fa07a90e0f8476bc3f5b2f833ed\` FOREIGN KEY (\`actualRoomTypeId\`) REFERENCES \`room_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`plan_activity_accomodation\` ADD CONSTRAINT \`FK_54cbef4d958b29416d8f1898724\` FOREIGN KEY (\`planActivityId\`) REFERENCES \`plan_activity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`plan_activity_accomodation\` ADD CONSTRAINT \`FK_f68d26c16972aef72c4cfadf460\` FOREIGN KEY (\`planRoomTypeId\`) REFERENCES \`room_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`plan_activity\` ADD CONSTRAINT \`FK_9e36b1666cc99d5d0e2d3e9195d\` FOREIGN KEY (\`timesheetTypeCode\`) REFERENCES \`timesheet_type\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`plan_activity\` ADD CONSTRAINT \`FK_9d888ef7900e9d0e6f09bad8cf5\` FOREIGN KEY (\`contractServiceId\`) REFERENCES \`contract_service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`plan_activity\` ADD CONSTRAINT \`FK_d4b276c9b6d48c0a0fde8304efe\` FOREIGN KEY (\`subContractorId\`) REFERENCES \`sub_contractor\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`plan_activity\` ADD CONSTRAINT \`FK_6ff7cbb62763f0e91e54e92a725\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`plan_activity\` ADD CONSTRAINT \`FK_c868a9973cd24d525065b69edae\` FOREIGN KEY (\`shorebaseServiceId\`) REFERENCES \`shorebase_service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`plan_activity\` ADD CONSTRAINT \`FK_b5e1d5c4231b29ed14a1ab42cec\` FOREIGN KEY (\`uomCode\`) REFERENCES \`uom\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`actual_activity_meal\` ADD CONSTRAINT \`FK_6acb05f521955accf3394ea72df\` FOREIGN KEY (\`actualActivityId\`) REFERENCES \`actual_activity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`actual_activity\` ADD CONSTRAINT \`FK_a3f5cd82d02413f218c9fc6f47f\` FOREIGN KEY (\`planActivityId\`) REFERENCES \`plan_activity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`actual_activity\` ADD CONSTRAINT \`FK_0680673190a905d277628ac8586\` FOREIGN KEY (\`timesheetTypeCode\`) REFERENCES \`timesheet_type\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`actual_activity\` ADD CONSTRAINT \`FK_75ca2a054979be0e93435373c80\` FOREIGN KEY (\`contractServiceId\`) REFERENCES \`contract_service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`actual_activity\` ADD CONSTRAINT \`FK_0d7ab048cbf99e57dcd06793043\` FOREIGN KEY (\`subContractorId\`) REFERENCES \`sub_contractor\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`actual_activity\` ADD CONSTRAINT \`FK_8e4c51671b6c522bd2d543f6aa8\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`actual_activity\` ADD CONSTRAINT \`FK_982293770430d107d5b7d05e277\` FOREIGN KEY (\`shorebaseServiceId\`) REFERENCES \`shorebase_service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`actual_activity\` ADD CONSTRAINT \`FK_5b89ddef29f661e502a434bb368\` FOREIGN KEY (\`uomCode\`) REFERENCES \`uom\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`timesheet_activity\` ADD CONSTRAINT \`FK_ff921277816abf356acc5e8f3b2\` FOREIGN KEY (\`actualActivityId\`) REFERENCES \`actual_activity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`actual_activity_mh\` ADD CONSTRAINT \`FK_fa4de58f1e182bb14b68fd2da1b\` FOREIGN KEY (\`actualActivityId\`) REFERENCES \`actual_activity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`actual_activity_mh\` ADD CONSTRAINT \`FK_502485bfa518597a656be8493ad\` FOREIGN KEY (\`actualProductId\`) REFERENCES \`shorebase_service_product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`actual_activity_mh\` ADD CONSTRAINT \`FK_be657ad3527cf6dbf11ef3f4f29\` FOREIGN KEY (\`equipmentId\`) REFERENCES \`equipment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`actual_activity_mh\` DROP FOREIGN KEY \`FK_be657ad3527cf6dbf11ef3f4f29\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity_mh\` DROP FOREIGN KEY \`FK_502485bfa518597a656be8493ad\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity_mh\` DROP FOREIGN KEY \`FK_fa4de58f1e182bb14b68fd2da1b\``);
        await queryRunner.query(`ALTER TABLE \`timesheet_activity\` DROP FOREIGN KEY \`FK_ff921277816abf356acc5e8f3b2\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity\` DROP FOREIGN KEY \`FK_5b89ddef29f661e502a434bb368\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity\` DROP FOREIGN KEY \`FK_982293770430d107d5b7d05e277\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity\` DROP FOREIGN KEY \`FK_8e4c51671b6c522bd2d543f6aa8\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity\` DROP FOREIGN KEY \`FK_0d7ab048cbf99e57dcd06793043\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity\` DROP FOREIGN KEY \`FK_75ca2a054979be0e93435373c80\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity\` DROP FOREIGN KEY \`FK_0680673190a905d277628ac8586\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity\` DROP FOREIGN KEY \`FK_a3f5cd82d02413f218c9fc6f47f\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity_meal\` DROP FOREIGN KEY \`FK_6acb05f521955accf3394ea72df\``);
        await queryRunner.query(`ALTER TABLE \`plan_activity\` DROP FOREIGN KEY \`FK_b5e1d5c4231b29ed14a1ab42cec\``);
        await queryRunner.query(`ALTER TABLE \`plan_activity\` DROP FOREIGN KEY \`FK_c868a9973cd24d525065b69edae\``);
        await queryRunner.query(`ALTER TABLE \`plan_activity\` DROP FOREIGN KEY \`FK_6ff7cbb62763f0e91e54e92a725\``);
        await queryRunner.query(`ALTER TABLE \`plan_activity\` DROP FOREIGN KEY \`FK_d4b276c9b6d48c0a0fde8304efe\``);
        await queryRunner.query(`ALTER TABLE \`plan_activity\` DROP FOREIGN KEY \`FK_9d888ef7900e9d0e6f09bad8cf5\``);
        await queryRunner.query(`ALTER TABLE \`plan_activity\` DROP FOREIGN KEY \`FK_9e36b1666cc99d5d0e2d3e9195d\``);
        await queryRunner.query(`ALTER TABLE \`plan_activity_accomodation\` DROP FOREIGN KEY \`FK_f68d26c16972aef72c4cfadf460\``);
        await queryRunner.query(`ALTER TABLE \`plan_activity_accomodation\` DROP FOREIGN KEY \`FK_54cbef4d958b29416d8f1898724\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity_accomodation\` DROP FOREIGN KEY \`FK_fa07a90e0f8476bc3f5b2f833ed\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity_accomodation\` DROP FOREIGN KEY \`FK_f172d7988bcd4eeb81c292f9c70\``);
        await queryRunner.query(`ALTER TABLE \`plan_activity_jetty\` DROP FOREIGN KEY \`FK_ae56b9526693898ae0cdca18f39\``);
        await queryRunner.query(`ALTER TABLE \`plan_activity_jetty\` DROP FOREIGN KEY \`FK_a1a9253e8beb0477b65bc11f82e\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity_jetty\` DROP FOREIGN KEY \`FK_e00076b3aa536f53dcd9ba3e4c3\``);
        await queryRunner.query(`ALTER TABLE \`actual_activity_jetty\` DROP FOREIGN KEY \`FK_72f00e93a254ef0782229101810\``);
        await queryRunner.query(`ALTER TABLE \`plan_activity_meal\` DROP FOREIGN KEY \`FK_64f3c3b1c3cc479388a288ddc54\``);
        await queryRunner.query(`ALTER TABLE \`plan_activity_mh\` DROP FOREIGN KEY \`FK_437118c60c38007c34f6d29381f\``);
        await queryRunner.query(`ALTER TABLE \`plan_activity_mh\` DROP FOREIGN KEY \`FK_21a1f2a7b67f54aca004ec57b1f\``);
        await queryRunner.query(`ALTER TABLE \`summary_timesheet\` CHANGE \`createdAt\` \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`timesheet_activity\` DROP COLUMN \`actualActivityId\``);
        await queryRunner.query(`ALTER TABLE \`activity\` DROP COLUMN \`planActivityId\``);
        await queryRunner.query(`DROP INDEX \`REL_fa4de58f1e182bb14b68fd2da1\` ON \`actual_activity_mh\``);
        await queryRunner.query(`DROP TABLE \`actual_activity_mh\``);
        await queryRunner.query(`DROP INDEX \`REL_a3f5cd82d02413f218c9fc6f47\` ON \`actual_activity\``);
        await queryRunner.query(`DROP TABLE \`actual_activity\``);
        await queryRunner.query(`DROP INDEX \`REL_6acb05f521955accf3394ea72d\` ON \`actual_activity_meal\``);
        await queryRunner.query(`DROP TABLE \`actual_activity_meal\``);
        await queryRunner.query(`DROP TABLE \`plan_activity\``);
        await queryRunner.query(`DROP INDEX \`REL_54cbef4d958b29416d8f189872\` ON \`plan_activity_accomodation\``);
        await queryRunner.query(`DROP TABLE \`plan_activity_accomodation\``);
        await queryRunner.query(`DROP TABLE \`room_type\``);
        await queryRunner.query(`DROP INDEX \`REL_f172d7988bcd4eeb81c292f9c7\` ON \`actual_activity_accomodation\``);
        await queryRunner.query(`DROP TABLE \`actual_activity_accomodation\``);
        await queryRunner.query(`DROP INDEX \`REL_a1a9253e8beb0477b65bc11f82\` ON \`plan_activity_jetty\``);
        await queryRunner.query(`DROP TABLE \`plan_activity_jetty\``);
        await queryRunner.query(`DROP TABLE \`ship\``);
        await queryRunner.query(`DROP INDEX \`REL_72f00e93a254ef078222910181\` ON \`actual_activity_jetty\``);
        await queryRunner.query(`DROP TABLE \`actual_activity_jetty\``);
        await queryRunner.query(`DROP INDEX \`REL_64f3c3b1c3cc479388a288ddc5\` ON \`plan_activity_meal\``);
        await queryRunner.query(`DROP TABLE \`plan_activity_meal\``);
        await queryRunner.query(`DROP INDEX \`REL_21a1f2a7b67f54aca004ec57b1\` ON \`plan_activity_mh\``);
        await queryRunner.query(`DROP TABLE \`plan_activity_mh\``);
    }

}

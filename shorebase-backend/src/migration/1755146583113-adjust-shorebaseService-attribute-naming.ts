import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustShorebaseServiceAttributeNaming1755146583113 implements MigrationInterface {
    name = 'AdjustShorebaseServiceAttributeNaming1755146583113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` DROP FOREIGN KEY \`FK_16b2727adb783febb7ee7e9690a\``);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` DROP FOREIGN KEY \`FK_af159e3194846d93125b4c1b77a\``);
        await queryRunner.query(`ALTER TABLE \`shorebase_service\` CHANGE \`deafult_price_per_uom\` \`defaultPricePerUom\` decimal(22,4) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` DROP COLUMN \`shorebaseServicesId\``);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` DROP COLUMN \`companiesId\``);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` ADD \`shorebaseServiceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` ADD \`companyId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` ADD CONSTRAINT \`FK_ed0d66cea1e39eaf5a441921560\` FOREIGN KEY (\`shorebaseServiceId\`) REFERENCES \`shorebase_service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` ADD CONSTRAINT \`FK_fa98bb29964eca656accf30069e\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` DROP FOREIGN KEY \`FK_fa98bb29964eca656accf30069e\``);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` DROP FOREIGN KEY \`FK_ed0d66cea1e39eaf5a441921560\``);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` DROP COLUMN \`companyId\``);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` DROP COLUMN \`shorebaseServiceId\``);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` ADD \`companiesId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` ADD \`shorebaseServicesId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`shorebase_service\` CHANGE \`defaultPricePerUom\` \`deafult_price_per_uom\` decimal(22,4) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` ADD CONSTRAINT \`FK_af159e3194846d93125b4c1b77a\` FOREIGN KEY (\`companiesId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shorebase_service_price\` ADD CONSTRAINT \`FK_16b2727adb783febb7ee7e9690a\` FOREIGN KEY (\`shorebaseServicesId\`) REFERENCES \`shorebase_service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

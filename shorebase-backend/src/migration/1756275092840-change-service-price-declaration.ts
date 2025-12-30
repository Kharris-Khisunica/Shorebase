import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeServicePriceDeclaration1756275092840 implements MigrationInterface {
    name = 'ChangeServicePriceDeclaration1756275092840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`st_component\` DROP FOREIGN KEY \`FK_37f92f309784509be70e3998f3b\``);
        await queryRunner.query(`ALTER TABLE \`st_component\` DROP FOREIGN KEY \`FK_ec5b6641a28e8cb33d113ec63f0\``);
        await queryRunner.query(`ALTER TABLE \`st_component\` DROP COLUMN \`contractServicePriceId\``);
        await queryRunner.query(`ALTER TABLE \`st_component\` DROP COLUMN \`shorebaseServicePriceId\``);
        await queryRunner.query(`ALTER TABLE \`st_component\` ADD \`pricePerUomContract\` decimal(22,4) NULL`);
        await queryRunner.query(`ALTER TABLE \`st_component\` ADD \`pricePerUomIndependent\` decimal(22,4) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`st_component\` DROP COLUMN \`pricePerUomIndependent\``);
        await queryRunner.query(`ALTER TABLE \`st_component\` DROP COLUMN \`pricePerUomContract\``);
        await queryRunner.query(`ALTER TABLE \`st_component\` ADD \`shorebaseServicePriceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`st_component\` ADD \`contractServicePriceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`st_component\` ADD CONSTRAINT \`FK_ec5b6641a28e8cb33d113ec63f0\` FOREIGN KEY (\`shorebaseServicePriceId\`) REFERENCES \`shorebase_service_price\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`st_component\` ADD CONSTRAINT \`FK_37f92f309784509be70e3998f3b\` FOREIGN KEY (\`contractServicePriceId\`) REFERENCES \`contract_service_price\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

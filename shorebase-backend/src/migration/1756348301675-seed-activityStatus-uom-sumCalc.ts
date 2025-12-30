import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedActivityStatusUomSumCalc1756348301675 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO uom(code,name)
            VALUES ('TON', 'Metrik Ton'),
                ('M', 'Meter')
            `);
        
        await queryRunner.query(`
            INSERT INTO activity_status(code, name)
            VALUES ('P', 'Plan'), ('A', 'Actual')
            `);

        await queryRunner.query(`
            INSERT INTO sum_calc(code, name)
            VALUES ('AVG', 'Average'), ('SUM', 'Sum')
            `)
    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM uom WHERE code IN ('TON', 'M')
            `)
        
        await queryRunner.query(`
            DELETE FROM activity_status WHERE code IN ('P', 'A')
            `)
        
        await queryRunner.query(`
            DELETE FROM sum_calc WHERE code IN ('AVG', 'SUM')
            `)
    
    }

}

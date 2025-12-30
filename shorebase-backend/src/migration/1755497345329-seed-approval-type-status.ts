import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedApprovalTypeStatus1755497345329 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO approval_type(code, name)
            VALUES ('T', 'Timesheet'),
                ('ST', 'Summary Timesheet'),
                ('PIN', 'Performa Invoice'),
                ('IN', 'Invoice')
        `);

        await queryRunner.query(`
            INSERT INTO approval_status(code, name, pass)
            VALUES ('A', 'Approved', TRUE),
                ('R', 'Rejected', TRUE)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM approval_type
            WHERE code IN ('T', 'ST', 'PIN', 'IN)
        `);

        await queryRunner.query(`
            DELETE FROM approval_status
            WHERE code IN ('A', 'R')
        `);
    }
}

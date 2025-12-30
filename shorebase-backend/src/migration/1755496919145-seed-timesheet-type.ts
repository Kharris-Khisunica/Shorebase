import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedTimesheetType1755496919145 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO timesheet_type(code, name)
            VALUES ('C', 'Contractor'),
                ('S', 'Subcontractor'),
                ('I', 'Independent')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM timesheet_type
            WHERE code IN ('C', 'S', 'I')
        `);
    }
}

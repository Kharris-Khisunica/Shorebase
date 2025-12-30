import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm"
import { JobPosition } from "./JobPosition.js";

@Entity()
export class JobTitle {
    @PrimaryGeneratedColumn()
    id: number
    
    @OneToMany(() => JobPosition, (position) => position.jobTitle)
    jobPositions: Relation<JobPosition[]>

    @Column({ type: 'varchar', length: 255 })
    code: string

    @Column({ type: 'varchar', length: 255 })
    name: string
    
    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date' })
    endDate: string;
}

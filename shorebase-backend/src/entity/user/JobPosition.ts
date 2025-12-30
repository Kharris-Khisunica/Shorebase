import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm"
import { Company } from "../company/Company.js"
import { JobTitle } from "./JobTitle.js"
import { UserPosition } from "./UserPosition.js"
import { ApprovalWorkflowStage } from "../approval/ApprovalWorkflowStage.js"
import { Approval } from "../approval/Approval.js"

@Entity()
export class JobPosition {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Company, (company) => company.jobPositions, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    company: Relation<Company>

    @ManyToOne(() => JobTitle, (jobTitle) => jobTitle.jobPositions, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    jobTitle: Relation<JobTitle>

    @ManyToOne(() => JobPosition, (position) => position.children, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    parent?: Relation<JobPosition>

    @OneToMany(() => JobPosition, (position) => position.parent)
    children: Relation<JobPosition[]>

    @Column({ type: 'varchar', length: 255 })
    name: string

    @Column({ type: 'date' })
    startDate: string

    @Column({ type: 'date' })
    endDate: string

    @OneToMany(() => UserPosition, (userPosition) => userPosition.jobPosition)
    userPositions: Relation<UserPosition[]>

    @OneToMany(()=>ApprovalWorkflowStage, (aws)=>aws.jobPosition)
    approvalWorkflowStages: Relation<ApprovalWorkflowStage[]>

    @OneToMany(()=>Approval, (ap)=>ap.jobPosition)
    approvals: Relation<Approval[]>
}

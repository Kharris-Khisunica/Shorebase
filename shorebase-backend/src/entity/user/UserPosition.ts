import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm"
import { User } from "./User.js"
import { JobPosition } from "./JobPosition.js"
import { ApprovalWorkflowStage } from "../approval/ApprovalWorkflowStage.js"

@Entity()
export class UserPosition {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.userPositions, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    user: Relation<User>

    @ManyToOne(() => JobPosition, (jobPosition) => jobPosition.userPositions, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    jobPosition: Relation<JobPosition>

    @Column({ type: 'date' })
    startDate: string

    @Column({ type: 'date' })
    endDate: string

    @OneToMany(() => ApprovalWorkflowStage, (aws) => aws.userPosition, { nullable: true })
    approvalWorkflowStages: Relation<ApprovalWorkflowStage[]>
}

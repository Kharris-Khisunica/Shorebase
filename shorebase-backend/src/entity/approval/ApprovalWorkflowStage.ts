import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm"
import { Approval } from "./Approval.js";
import { JobPosition } from "../user/JobPosition.js";
import { ApprovalWorkflow } from "./ApprovalWorkflow.js";
import { UserPosition } from "../user/UserPosition.js";


@Entity()
export class ApprovalWorkflowStage{
 
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>ApprovalWorkflow, (taw)=>taw.approvalWorkstages)
    approvalWorkflow: Relation<ApprovalWorkflow>

    @Column({type: `int`})
    level: number;

    @OneToMany(()=>Approval, (tsa)=>tsa.approvalWorkflowStage)
    approvals: Relation<Approval[]>

    @ManyToOne(()=>JobPosition, (jp)=>jp.approvalWorkflowStages)
    jobPosition: Relation<JobPosition>

    @ManyToOne(() => UserPosition, (up) => up.approvalWorkflowStages, { nullable: true })
    userPosition: Relation<UserPosition>
}
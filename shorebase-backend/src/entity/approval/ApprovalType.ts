import { Collection, Column, Entity, ManyToOne, OneToMany, PrimaryColumn, Relation } from "typeorm";
import { Approval } from "./Approval.js";
import { ApprovalWorkflow } from "./ApprovalWorkflow.js";


@Entity()
export class ApprovalType{

    @PrimaryColumn({type: 'varchar', length: 255})
    code: string;

    @Column({type:'varchar', length: 255})
    name: string;

    @OneToMany(() => ApprovalWorkflow, (af) => af.type)
    approvalWorkflows: Relation<ApprovalWorkflow[]>

    @OneToMany(() => Approval, (approval) => approval.approvalType)
    approvals: Relation<Approval[]>
}
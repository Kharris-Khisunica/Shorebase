import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm"
import { Timesheet } from "../timesheet/Timesheet.js";
import { ApprovalType } from "./ApprovalType.js";
import { ApprovalWorkflowStage } from "./ApprovalWorkflowStage.js";
import { ApprovalStatus } from "./ApprovalStatus.js";
import { User } from "../user/User.js";
import { UserPosition } from "../user/UserPosition.js";
import { JobPosition } from "../user/JobPosition.js";
import { UserSignature } from "../user/UserSignature.js";
import { Invoice } from "../invoice/Invoice.js";
import { PerformaInvoice } from "../invoice/PerformaInvoice.js";
import { SummaryTimesheet } from "../summaryTimesheet/SummaryTimesheet.js";



@Entity()
export class Approval{
 
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>ApprovalType, (at)=>at.approvals)
    approvalType: Relation<ApprovalType>

    @ManyToOne(()=>Timesheet, (ts)=>ts.approvals, {nullable: true})
    timesheet: Relation<Timesheet>

    //Summary Time sheet
    @ManyToOne(()=>SummaryTimesheet, (sts)=>sts.approvals, {nullable: true})
    summaryTimesheet: Relation<SummaryTimesheet>
    
    //Performa Invoice
    @ManyToOne(()=>PerformaInvoice, (pi)=>pi.approvals, {nullable: true})
    performaInvoice: Relation<PerformaInvoice>

    // Invoice
    @ManyToOne(()=>Invoice, (invoice)=>invoice.approvals, {nullable: true})
    invoice: Relation<Invoice>

    @ManyToOne(()=>ApprovalWorkflowStage, (aws)=>aws.approvals)
    approvalWorkflowStage: Relation<ApprovalWorkflowStage>

    @ManyToOne(()=>ApprovalStatus, (as)=>as.approvals)
    approvalStatus: Relation<ApprovalStatus>

    @ManyToOne(()=>User, (user)=>user.approvals)
    user: Relation<User>

    @ManyToOne(()=>JobPosition, (jp)=>jp.approvals)
    jobPosition: Relation<JobPosition>

    @ManyToOne(()=>UserSignature, (us)=>us.approvals)
    userSignature: Relation<UserSignature>

    @Column({type:'varchar', length:255})
    remark: string;

}
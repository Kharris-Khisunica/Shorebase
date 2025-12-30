import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm"
import { Timesheet } from "../timesheet/Timesheet.js";
import { Contract } from "../contractService/Contract.js";
import { ApprovalWorkflowStage } from "./ApprovalWorkflowStage.js";
import { Approval } from "./Approval.js";
import { TimesheetType } from "../timesheet/TimesheetType.js";
import { SubContractor } from "../company/SubContractor.js";
import { Company } from "../company/Company.js";
import { ApprovalType } from "./ApprovalType.js";

@Entity()
export class ApprovalWorkflow{
 
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ApprovalType, (af) => af.approvalWorkflows)
    type: Relation<ApprovalType>

    @ManyToOne(()=> TimesheetType, (tt) => tt.approvalWorkflows)
    timesheetType: Relation<TimesheetType>

    @ManyToOne(()=>Contract, (contract)=>contract.approvalWorkflows, {nullable: true})
    contract: Relation<Contract>

    @ManyToOne(()=>SubContractor, (sc)=>sc.approvalWorkflows, {nullable: true})
    subContractor: Relation<SubContractor>

    @ManyToOne(()=>Company, (company)=>company.approvalWorkflows, {nullable: true})
    company:Relation<Company>

    @Column({type: `date`})
    startDate: string;

    @Column({type: `date`})
    endDate: string;

    @OneToMany(()=>ApprovalWorkflowStage, (saw)=>saw.approvalWorkflow, { cascade: true })
    approvalWorkstages: Relation<ApprovalWorkflowStage[]>
}
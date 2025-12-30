import { Entity, Column, PrimaryColumn, OneToOne, Unique, PrimaryGeneratedColumn, Relation, OneToMany, ManyToOne } from "typeorm"
import { ContractService } from "./ContractService.js";
import { Company } from "../company/Company.js";
import { ApprovalWorkflow } from "../approval/ApprovalWorkflow.js";
import { SubContractor } from "../company/SubContractor.js";
import { SummaryTimesheet } from "../summaryTimesheet/SummaryTimesheet.js";

@Entity()
export class Contract{
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(() => Company, (company)=>company.contracts, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    company: Relation<Company>

    @Column({type: 'varchar', length:255})
    name: string;

    @Column({type:`varchar`, length:255})
    contractNumber: string

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date' })
    endDate: string;

    @OneToMany(()=>ContractService, (cs)=>cs.contract)
    contractServices: Relation<ContractService[]>

    @OneToMany(()=>SubContractor, (sc)=>sc.contract)
    subContractors: Relation<SubContractor>

    @OneToMany(()=>ApprovalWorkflow, (aw)=>aw.contract)
    approvalWorkflows: Relation<ApprovalWorkflow[]>

    @OneToMany(()=>SummaryTimesheet, (sts)=>sts.contract)
    summaryTimesheets: Relation<SummaryTimesheet[]>
}

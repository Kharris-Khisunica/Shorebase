import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm";
import { STComponent } from "./STComponent.js";
import { TimesheetType } from "../timesheet/TimesheetType.js";
import { PerformaInvoice } from "../invoice/PerformaInvoice.js";
import { Approval } from "../approval/Approval.js";
import { Contract } from "../contractService/Contract.js";
import { ShorebaseService } from "../contractService/ShorebaseService.js";
import { Company } from "../company/Company.js";

@Entity()
export class SummaryTimesheet{
    
    @PrimaryGeneratedColumn()
    id:number;

    @OneToMany(()=>STComponent, (stc)=>stc.summaryTimesheet, {cascade: true, onDelete:"CASCADE"})
    stComponents: Relation<STComponent[]>

    @ManyToOne(()=>TimesheetType, (tt)=>tt.summaryTimesheets)
    timesheetType: Relation<TimesheetType>

    // Contract
    @ManyToOne(()=>Contract, (contract)=>contract.summaryTimesheets, {nullable: true})
    contract: Relation<Contract>

    // Company
    @ManyToOne(()=>Company, (company)=>company.summaryTimesheets, {nullable: true})
    company: Relation<Company>

    @Column({type: 'varchar', length: 255})
    code: string;
    
    @Column({type: 'date'})
    periodStartDate: string;

    @Column({type: 'date'})
    periodEndDate: string;

    @Column({type: 'date'})
    issueDate: string;

    @Column({type: "datetime"})
    createdAt: string;

    @OneToOne(()=>PerformaInvoice, (pi)=>pi.summaryTimesheet)
    performaInvoice: Relation<PerformaInvoice>

    @OneToMany(()=>Approval, (ap)=>ap.summaryTimesheet)
    approvals: Relation<Approval[]>
}
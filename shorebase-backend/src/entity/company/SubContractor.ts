import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm"
import { Contract } from "../contractService/Contract.js";
import { Company } from "./Company.js";
import { Activity } from "../activity/Activity.js";
import { Timesheet } from "../timesheet/Timesheet.js";
import { ApprovalWorkflow } from "../approval/ApprovalWorkflow.js";
import { ActualActivity } from "../actualActivity/ActualActivity.js";
import { PlanActivity } from "../planActivity/PlanActivity.js";


@Entity()
export class SubContractor{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>Contract, (contract)=>contract.subContractors)
    contract: Relation<Contract>

    @ManyToOne(()=>Company, (company)=>company.subContractors)
    company: Relation<Company>

    @Column({type: `date`})
    startDate: string;

    @Column({type: `date`})
    endDate: string;

    @OneToMany(()=>Activity,(activity)=>activity.subContractor)
    activities: Relation<Activity[]>

    @OneToMany(()=>ActualActivity,(activity)=>activity.subContractor)
    actualActivities: Relation<ActualActivity[]>

    @OneToMany(()=>PlanActivity,(activity)=>activity.subContractor)
    planActivities: Relation<PlanActivity[]>
    
    @OneToMany(()=>Timesheet, (timesheet)=>timesheet.subContractor)
    timesheets: Relation<Timesheet[]>

    @OneToMany(()=>ApprovalWorkflow, (aw)=>aw.subContractor)
    approvalWorkflows: Relation<ApprovalWorkflow[]>
}
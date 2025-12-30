import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm"
import { JobPosition } from "../user/JobPosition.js";
import { ContractService } from "../contractService/ContractService.js";
import { Contract } from "../contractService/Contract.js";
import { ShorebaseService } from "../contractService/ShorebaseService.js";
import { SubContractor } from "./SubContractor.js";
import { ShorebaseServicePrice } from "../contractService/ShorebaseServicePrice.js";
import { Activity } from "../activity/Activity.js";
import { Timesheet } from "../timesheet/Timesheet.js";
import { ApprovalWorkflow } from "../approval/ApprovalWorkflow.js";
import { SummaryTimesheet } from "../summaryTimesheet/SummaryTimesheet.js";
import { STComponent } from "../summaryTimesheet/STComponent.js";
import { PlanActivity } from "../planActivity/PlanActivity.js";
import { ActualActivity } from "../actualActivity/ActualActivity.js";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 255 })
    name: string

    @Column({type: 'boolean'})
    internal: boolean;

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date' })
    endDate: string;

    @OneToMany(() => JobPosition, (jtp) => jtp.company)
    jobPositions: Relation<JobPosition[]>

    @OneToMany(() => ContractService, (cs)=>cs.company)
    contractServices: Relation<ContractService[]>

    @OneToMany(() => Contract, (contract)=>contract.company)
    contracts: Relation<Contract[]>

    @OneToMany(()=>SubContractor, (sc)=>sc.company)
    subContractors: Relation<SubContractor[]>

    @OneToMany(()=>ShorebaseServicePrice, (ssp)=>ssp.company)
    shorebaseServicePrices: Relation<ShorebaseServicePrice[]>

    @OneToMany(()=>Activity, (activity)=>activity.company)
    activities: Relation<Activity[]>

    @OneToMany(()=>PlanActivity, (activity)=>activity.company)
    planActivities: Relation<PlanActivity[]>

    @OneToMany(()=>ActualActivity, (activity)=>activity.company)
    actualActivities: Relation<ActualActivity[]>

    @OneToMany(()=>Timesheet, (timesheet)=>timesheet.company)
    timesheets: Relation<Timesheet[]>

    @OneToMany(()=>ApprovalWorkflow, (aw)=>aw.company)
    approvalWorkflows: Relation<ApprovalWorkflow[]>

    @OneToMany(()=>SummaryTimesheet, (sts)=>sts.company)
    summaryTimesheets: Relation<SummaryTimesheet[]>

    @OneToMany(()=>STComponent, (sts)=>sts.company)
    stComponents: Relation<STComponent[]>
}

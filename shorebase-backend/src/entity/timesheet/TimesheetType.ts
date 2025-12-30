import { Column, Entity, OneToMany, PrimaryColumn, Relation } from "typeorm";
import { Activity } from "../activity/Activity.js";
import { Timesheet } from "./Timesheet.js";
import { ApprovalWorkflow } from "../approval/ApprovalWorkflow.js";
import { SummaryTimesheet } from "../summaryTimesheet/SummaryTimesheet.js";
import { ActualActivity } from "../actualActivity/ActualActivity.js";
import { PlanActivity } from "../planActivity/PlanActivity.js";

@Entity()
export class TimesheetType{

    @PrimaryColumn({type:'varchar', length:255})
    code: string;

    @Column({type:'varchar', length:255})
    name:string;

    @OneToMany(()=>Activity, (activity)=>activity.timesheetType)
    activities: Relation<Activity[]>

    @OneToMany(()=>ActualActivity, (activity)=>activity.timesheetType)
    actualActivities: Relation<ActualActivity[]>

    @OneToMany(()=>PlanActivity, (activity)=>activity.timesheetType)
    planActivities: Relation<PlanActivity[]>

    @OneToMany(()=>Timesheet, (timesheet)=>timesheet.timesheetType)
    timesheets: Relation<Timesheet[]>

    @OneToMany(()=>ApprovalWorkflow, (aw)=>aw.timesheetType)
    approvalWorkflows: Relation<ApprovalWorkflow[]>

    @OneToMany(()=>SummaryTimesheet, (sts)=>sts.timesheetType)
    summaryTimesheets: Relation<SummaryTimesheet[]>
}
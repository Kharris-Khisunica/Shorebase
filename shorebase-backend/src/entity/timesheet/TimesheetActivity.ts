import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm"
import { Timesheet } from "./Timesheet.js";
import { Activity } from "../activity/Activity.js";
import { ActualActivity } from "../actualActivity/ActualActivity.js";


@Entity()
export class TimesheetActivity{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>Timesheet, (timesheet)=>timesheet.timesheetActivities)
    timesheet: Relation<Timesheet>

    @ManyToOne(()=>Activity, (aa)=>aa.timesheetActivities)
    activity: Relation<Activity>

    @ManyToOne(()=>ActualActivity, (aa)=>aa.timesheetActivities)
    actualActivity: Relation<ActualActivity>

    @Column({type:`varchar`, length:1023, nullable: true})
    remarks: string;


}
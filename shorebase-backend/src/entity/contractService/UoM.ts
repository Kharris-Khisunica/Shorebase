import { Entity, Column, PrimaryColumn, OneToOne, Unique, PrimaryGeneratedColumn, Relation, OneToMany } from "typeorm"
import { ContractService } from "./ContractService.js"
import{ ShorebaseService } from "./ShorebaseService.js"
import { Activity } from "../activity/Activity.js"
import { Timesheet } from "../timesheet/Timesheet.js"
import { STComponent } from "../summaryTimesheet/STComponent.js"
import { ShorebaseServiceProduct } from "./ShorebaseServiceProduct.js"
import { ActualActivity } from "../actualActivity/ActualActivity.js"
import { PlanActivity } from "../planActivity/PlanActivity.js"
@Entity({name:"uom"})
export class UoM{
    
    @PrimaryColumn({type: 'varchar', length: 255})
    code: string

    @Column({type: `varchar`, length: 255})
    name: string

    @OneToMany(()=>ContractService, (cs)=>cs.uom, {cascade: true, onDelete: 'CASCADE'})
    contractServices: Relation<ContractService[]>

    @OneToMany(()=>ShorebaseService, (ss)=>ss.uom,{cascade: true, onDelete: 'CASCADE'})
    shorebaseServices: Relation<ShorebaseService[]>
    
    @OneToMany(()=>Activity, (activity)=>activity.uom,{cascade: true, onDelete: 'CASCADE'})
    activities: Relation<Activity[]>

    @OneToMany(()=>ActualActivity, (activity)=>activity.uom,{cascade: true, onDelete: 'CASCADE'})
    actualActivities: Relation<ActualActivity[]>

    @OneToMany(()=>PlanActivity, (activity)=>activity.uom,{cascade: true, onDelete: 'CASCADE'})
    planActivities: Relation<PlanActivity[]>

    @OneToMany(()=>Timesheet, (timesheet)=>timesheet.uom,{cascade: true, onDelete: 'CASCADE'})
    timesheets: Relation<Timesheet[]>

    @OneToMany(()=>STComponent, (stc)=>stc.uom,{cascade: true, onDelete: 'CASCADE'})
    stComponents: Relation<STComponent[]>

    @OneToMany(() => ShorebaseServiceProduct, (ssp)=>ssp.uom)
    shorebaseServiceProducts: Relation<ShorebaseServiceProduct[]>
}
import { Entity, Column, PrimaryColumn, OneToOne, Unique, PrimaryGeneratedColumn, Relation, OneToMany, ManyToOne, ManyToMany, JoinTable } from "typeorm"
import { ContractService } from "./ContractService.js"
import { Company } from "../company/Company.js"
import { UoM } from "./UoM.js"
import { ShorebaseServicePrice } from "./ShorebaseServicePrice.js"
import { Activity } from "../activity/Activity.js"
import { Timesheet } from "../timesheet/Timesheet.js"
import { STComponent } from "../summaryTimesheet/STComponent.js"
import { SummaryTimesheet } from "../summaryTimesheet/SummaryTimesheet.js"
import { ShorebaseServiceProduct } from "./ShorebaseServiceProduct.js"
import { ActualActivity } from "../actualActivity/ActualActivity.js"
import { PlanActivity } from "../planActivity/PlanActivity.js"
import { ShorebaseServiceType } from "./ShorebaseServiceType.js"


@Entity()
export class ShorebaseService{
   @PrimaryGeneratedColumn()
   id: number
   
   @Column({type:`varchar`, length:255, unique:true})
   code: string

   @Column({type:`varchar`, length:255})
   name: string

   @Column({type:`varchar`, length:1023})
   description: string

   @ManyToOne(()=>UoM, (uom)=>uom.shorebaseServices, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
   uom: Relation<UoM>

   @Column({type: `decimal`, precision:22, scale:4})
   defaultPricePerUom: number

   @ManyToOne(()=>ShorebaseServiceType, (sst)=>sst.shorebaseService)
   ssType: Relation<ShorebaseServiceType>

   @Column({type:`bool`})
   active: boolean;

   @Column({ type: 'date' })
   startDate: string;

   @Column({ type: 'date' })
   endDate: string;

   @OneToMany(() => ContractService, (cs)=>cs.shorebaseService,{cascade: true, onDelete: 'CASCADE'})
   contractServices: Relation<ContractService[]>

   @OneToMany(()=>ShorebaseServicePrice, (ssp)=>ssp.shorebaseService,{cascade: true, onDelete: 'CASCADE'})
   shorebaseServicePrices: Relation<ShorebaseServicePrice[]>

    @OneToMany(()=>Activity, (activity)=>activity.shorebaseService,{cascade: true, onDelete: 'CASCADE'})
    activities: Relation<Activity[]>

    @OneToMany(()=>ActualActivity, (activity)=>activity.shorebaseService,{cascade: true, onDelete: 'CASCADE'})
    actualActivities: Relation<ActualActivity[]>

    @OneToMany(()=>PlanActivity, (activity)=>activity.shorebaseService,{cascade: true, onDelete: 'CASCADE'})
    planActivities: Relation<PlanActivity[]>
    
    @OneToMany(()=>Timesheet, (timesheet)=>timesheet.shorebaseService, {cascade: true, onDelete: 'CASCADE'})
    timesheets: Relation<Timesheet[]>

    @OneToMany(()=>STComponent, (stc)=>stc.shorebaseService, {cascade: true, onDelete: 'CASCADE'})
    stComponents: Relation<STComponent[]>



}
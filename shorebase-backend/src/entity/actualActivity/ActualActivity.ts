// Berisi atribut yang sama dari semua actual Activity

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { ContractService } from "../contractService/ContractService.js";
import { SubContractor } from "../company/SubContractor.js";
import { Company } from "../company/Company.js";
import { ShorebaseService } from "../contractService/ShorebaseService.js";
import { UoM } from "../contractService/UoM.js";
import { TimesheetActivity } from "../timesheet/TimesheetActivity.js";
import { TimesheetType } from "../timesheet/TimesheetType.js";
import { PlanActivity } from "../planActivity/PlanActivity.js";
import { ActualActivityMH } from "./ActualActivity-MH.js";
import { ActualActivityMeal } from "./ActualActivity-Meal.js";
import { ActualActivityJetty } from "./ActualActivity-Jetty.js";
import { ActualActivityAccomodation } from "./ActualActivity-Accomodation.js";

@Entity()
export class ActualActivity{

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=>PlanActivity, (pa)=>pa.actualActivity, {nullable: true})
    @JoinColumn()
    planActivity: Relation<PlanActivity>;
    
    //Type Code
    @ManyToOne(()=>TimesheetType, (tt)=>tt.actualActivities)
    timesheetType: Relation<TimesheetType>

    @ManyToOne(()=>ContractService, (cs)=>cs.actualActivities, {nullable: true})
    contractService: Relation<ContractService>

    @ManyToOne(()=>SubContractor, (sc)=>sc.actualActivities, {nullable: true})
    subContractor: Relation<SubContractor>

    @ManyToOne(()=>Company, (company)=>company.actualActivities, {nullable: true})
    company:Relation<Company>

    @ManyToOne(()=>ShorebaseService, (ss)=>ss.actualActivities, {nullable: true})
    shorebaseService:Relation<ShorebaseService>

    @ManyToOne(()=>UoM, (uom)=>uom.actualActivities, {nullable: true})
    uom:Relation<UoM>

    @Column({type: 'varchar', length:255})
    description: string;

    @Column({type: 'varchar', length:255, nullable:true})
    code: string;

    @Column({type:'varchar', length:1023, nullable: true})
    remark: string;


    @OneToMany(()=>TimesheetActivity, (tsa)=>tsa.actualActivity)
    timesheetActivities:Relation<TimesheetActivity[]>


    @OneToOne(()=>ActualActivityMH, (aamh)=>aamh.actualActivity)
    actualActivityMH: Relation<ActualActivityMH>

    @OneToOne(()=>ActualActivityMeal, (aam)=>aam.actualActivity)
    actualActivityMeal: Relation<ActualActivityMeal>

    @OneToOne(()=>ActualActivityJetty, (aaj)=>aaj.actualActivity)
    actualActivityJetty: Relation<ActualActivityJetty>

    @OneToOne(()=>ActualActivityAccomodation, (aaa)=>aaa.actualActivity)
    actualActivityAccomodation: Relation<ActualActivityAccomodation>    
}
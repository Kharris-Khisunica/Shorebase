// Berisi atribut yang sama dari semua plan Activity

import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { ContractService } from "../contractService/ContractService.js";
import { SubContractor } from "../company/SubContractor.js";
import { Company } from "../company/Company.js";
import { ShorebaseService } from "../contractService/ShorebaseService.js";
import { UoM } from "../contractService/UoM.js";
import { TimesheetActivity } from "../timesheet/TimesheetActivity.js";
import { TimesheetType } from "../timesheet/TimesheetType.js";
import { PlanActivityMH } from "./PlanActivity-MH.js";
import { PlanActivityMeal } from "./PlanActivity-Meal.js";
import { PlanActivityJetty } from "./PlanActivity-Jetty.js";
import { PlanActivityAccomodation } from "./PlanActivity-Accomodation.js";
import { ActualActivity } from "../actualActivity/ActualActivity.js";
import { ActivityStatus } from "../activity/ActivityStatus.js";

@Entity()
export class PlanActivity{

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=>ActualActivity, (aa)=>aa.planActivity, {nullable: true})
    actualActivity: Relation<ActualActivity>;
    
    //Type Code
    @ManyToOne(()=>TimesheetType, (tt)=>tt.planActivities)
    timesheetType: Relation<TimesheetType>

    @ManyToOne(()=>ContractService, (cs)=>cs.planActivities, {nullable: true})
    contractService: Relation<ContractService>

    @ManyToOne(()=>SubContractor, (sc)=>sc.planActivities, {nullable: true})
    subContractor: Relation<SubContractor>

    @ManyToOne(()=>Company, (company)=>company.planActivities, {nullable: true})
    company:Relation<Company>

    @ManyToOne(()=>ShorebaseService, (ss)=>ss.planActivities, {nullable: true})
    shorebaseService:Relation<ShorebaseService>

    @ManyToOne(()=>UoM, (uom)=>uom.planActivities, {nullable: true})
    uom:Relation<UoM>

    @Column({type:'varchar', length:1023, nullable: true})
    remark: string;

    @Column({type: 'varchar', length:255})
    description: string;

    @Column({type: 'varchar', length:255, nullable:true})
    code: string;

    @ManyToOne(()=>ActivityStatus, (pa)=>pa.activities)
    status: Relation<ActivityStatus>

    @OneToOne(()=>PlanActivityMH, (pamh)=>pamh.planActivity)
    planActivityMH: Relation<PlanActivityMH>

    @OneToOne(()=>PlanActivityMeal, (pam)=>pam.planActivity)
    planActivityMeal: Relation<PlanActivityMeal>

    @OneToOne(()=>PlanActivityJetty, (paj)=>paj.planActivity)
    planActivityJetty: Relation<PlanActivityJetty>

    @OneToOne(()=>PlanActivityAccomodation, (paa)=>paa.planActivity)
    planActivityAccomodation: Relation<PlanActivityAccomodation>    
}
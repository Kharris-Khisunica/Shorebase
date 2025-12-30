import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { ActivityStatus } from "./ActivityStatus.js";
import { ContractService } from "../contractService/ContractService.js";
import { SubContractor } from "../company/SubContractor.js";
import { Company } from "../company/Company.js";
import { ShorebaseService } from "../contractService/ShorebaseService.js";
import { UoM } from "../contractService/UoM.js";
import { TimesheetActivity } from "../timesheet/TimesheetActivity.js";
import { TimesheetType } from "../timesheet/TimesheetType.js";
import { Equipment } from "./Equipment.js";
import { ShorebaseServiceProduct } from "../contractService/ShorebaseServiceProduct.js";

@Entity()
export class Activity{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>ActivityStatus, (as)=>as.activities)
    activityStatus: Relation<ActivityStatus>

    @Column({type: 'integer'})
    planActivityId: number;
    
    //Type Code
    @ManyToOne(()=>TimesheetType, (tt)=>tt.activities)
    timesheetType: Relation<TimesheetType>

    @ManyToOne(()=>ContractService, (cs)=>cs.activities, {nullable: true})
    contractService: Relation<ContractService>

    @ManyToOne(()=>SubContractor, (sc)=>sc.activities, {nullable: true})
    subContractor: Relation<SubContractor>

    @ManyToOne(()=>Company, (company)=>company.activities, {nullable: true})
    company:Relation<Company>

    @ManyToOne(()=>ShorebaseService, (ss)=>ss.activities, {nullable: true})
    shorebaseService:Relation<ShorebaseService>

    @ManyToOne(()=>ShorebaseServiceProduct, (ssp)=>ssp.activities)
    shorebaseServiceProduct:Relation<ShorebaseServiceProduct>

    @ManyToOne(()=>UoM, (uom)=>uom.activities, {nullable: true})
    uom:Relation<UoM>

    @Column({type: 'varchar', length: 255})
    code: string;

    @Column({type:'double', nullable: true})
    planProductQty: number;

    @Column({type:'double', nullable: true})
    planAmount: number;

    @Column({type:'date', nullable: true})
    planDate: string;

    @Column({type:'varchar', length:1023, nullable: true})
    planDescription:string;

    @Column({type:'double', nullable: true})
    actualProductQty: number;

    @Column({type:'double', nullable: true})
    actualAmount: number;

    @ManyToOne(() => Equipment, (eq)=>eq.activities)
    equipment: Relation<Equipment>

    @Column({type:'datetime', nullable: true})
    actualStartedAt: string;

    @Column({type:'datetime', nullable: true})
    actualEndedAt: string;

    @Column({type:'varchar', length:1023, nullable: true})
    actualDescription:string;


    @OneToMany(()=>TimesheetActivity, (tsa)=>tsa.activity)
    timesheetActivities:Relation<TimesheetActivity[]>
}
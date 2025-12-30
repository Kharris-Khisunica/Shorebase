import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm"
import { ContractService } from "../contractService/ContractService.js";
import { Company } from "../company/Company.js";
import { TimesheetActivity } from "./TimesheetActivity.js";
import { Approval } from "../approval/Approval.js";
import { SubContractor } from "../company/SubContractor.js";
import { ShorebaseService } from "../contractService/ShorebaseService.js";
import { UoM } from "../contractService/UoM.js";
import { TimesheetType } from "./TimesheetType.js";
import { STTimesheet } from "../summaryTimesheet/STTimesheet.js";


@Entity()
export class Timesheet{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>TimesheetType, (tt)=>tt.timesheets)
    timesheetType:Relation<TimesheetType>

    @ManyToOne(()=>ContractService, (cs)=>cs.timesheets, {nullable: true})
    contractService: Relation<ContractService>

    @ManyToOne(()=>SubContractor, (sc)=>sc.timesheets, {nullable: true})
    subContractor: Relation<SubContractor>

    @ManyToOne(()=>Company, (company)=>company.timesheets, {nullable: true})
    company: Relation<Company>

    @ManyToOne(()=>ShorebaseService, (ss)=>ss.timesheets, {nullable: true})
    shorebaseService: Relation<ShorebaseService>

    @ManyToOne(()=>UoM, (uom)=>uom.timesheets, {nullable: true})
    uom: Relation<UoM>

    @Column({type: 'varchar', length: 255})
    code: string;

    @Column({type: 'double'})
    totalAmount: number;

    @Column({type:`date`})
    issueDate: string;

    @Column({type: 'datetime'})
    createdAt: string;

    @Column({type: 'varchar', length:1023})
    description: string;

    @OneToMany(()=>TimesheetActivity, (tsa)=>tsa.timesheet, {cascade: true, onDelete: "CASCADE"})
    timesheetActivities: Relation<TimesheetActivity[]>

    @OneToMany(()=>Approval, (ap)=>ap.timesheet, {cascade: true, onDelete: "CASCADE"})
    approvals: Relation<Approval[]>

    @OneToOne(()=>STTimesheet, (stt)=>stt.timesheet)
    sttimesheet: Relation<STTimesheet>
}
import { Entity, Column, PrimaryColumn, OneToOne, Unique, PrimaryGeneratedColumn, Relation, OneToMany, ManyToOne } from "typeorm"
import { UoM } from "./UoM.js";
import { SumCalc } from "./SumCalc.js";
import { Company } from "../company/Company.js";
import { ShorebaseService } from "./ShorebaseService.js";
import { Contract } from "./Contract.js";
import { ContractServicePrice } from "./ContractServicePrice.js";
import { Activity } from "../activity/Activity.js";
import { Timesheet } from "../timesheet/Timesheet.js";
import { STComponent } from "../summaryTimesheet/STComponent.js";
import { PlanActivity } from "../planActivity/PlanActivity.js";
import { ActualActivity } from "../actualActivity/ActualActivity.js";

@Entity()
export class ContractService{

    @PrimaryGeneratedColumn()
    id: number

    // Contract id FK
    @ManyToOne(() => Contract, (contract) => contract.contractServices, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    contract: Relation<Contract>

    // ShorebaseService id FK
    @ManyToOne(() => ShorebaseService, (service)=>service.contractServices, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    shorebaseService: Relation<ShorebaseService>

    // Company id FK
    @ManyToOne(() => Company, (company)=>company.contractServices, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    company: Relation<Company>

    @Column({type:`varchar`, length:255})
    code: string

    // UoM id FK
    @ManyToOne(()=>UoM, (uom) => uom.contractServices, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    uom: Relation<UoM>

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date' })
    endDate: string;

    // Summary Calc Type
    @ManyToOne(() => SumCalc, (sumCalc) => sumCalc.contractServices, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    sumCalc: Relation<SumCalc>

    // One to Many ke Price
    @OneToMany(() => ContractServicePrice, (csp) => csp.contractService)
    contractServicePrices: Relation<ContractServicePrice[]>

    @OneToMany(()=>Activity, (activity)=>activity.contractService)
    activities: Relation<Activity[]>

    @OneToMany(()=>PlanActivity, (activity)=>activity.contractService)
    planActivities: Relation<PlanActivity[]>

    @OneToMany(()=>ActualActivity, (activity)=>activity.contractService)
    actualActivities: Relation<ActualActivity[]>

    @OneToMany(()=>Timesheet, (timesheet)=>timesheet.contractService)
    timesheets: Relation<Timesheet[]>

    @OneToMany(()=>STComponent, (stc)=>stc.contractService)
    stComponents: Relation<STComponent[]>
}
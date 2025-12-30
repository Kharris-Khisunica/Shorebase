import { Collection, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { STTimesheet } from "./STTimesheet.js";
import { ContractService } from "../contractService/ContractService.js";
import { ShorebaseService } from "../contractService/ShorebaseService.js";
import { UoM } from "../contractService/UoM.js";
import { SummaryTimesheet } from "./SummaryTimesheet.js";
import { ContractServicePrice } from "../contractService/ContractServicePrice.js";
import { ShorebaseServicePrice } from "../contractService/ShorebaseServicePrice.js";
import { Company } from "../company/Company.js";


@Entity()
export class STComponent{
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>SummaryTimesheet, (sts)=>sts.stComponents)
    summaryTimesheet: Relation<SummaryTimesheet>

    @ManyToOne(()=>ContractService, (cs)=>cs.stComponents, {nullable: true})
    contractService: Relation<ContractService>

    @ManyToOne(()=> ShorebaseService, (ss)=>ss.stComponents, {nullable: true})
    shorebaseService: Relation<ShorebaseService>

    @ManyToOne(()=>Company, (company)=>company.stComponents, {nullable: true})
    company: Relation<Company>

    @ManyToOne(()=>UoM, (uom)=>uom.stComponents, {nullable: true})
    uom: Relation<UoM>

    @Column({type: 'decimal', precision:22, scale: 4, nullable: true})
    pricePerUomContract: number;
    
    @Column({type: 'decimal', precision:22, scale: 4, nullable: true})
    pricePerUomIndependent: number;

    @Column({type: 'decimal', precision:22, scale: 4})
    actualPricePerUom: number;

    @Column({type: 'decimal', precision:22, scale:4})
    aggAmount: number;

    @Column({type: 'varchar', length:1023})
    remark: string;

    @OneToMany(()=>STTimesheet, (stt)=>stt.stComponent, {cascade: true, onDelete: "CASCADE"})
    sttimesheets: Relation<STTimesheet[]>
}
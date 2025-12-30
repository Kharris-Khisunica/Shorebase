import { Entity, Column, PrimaryColumn, OneToOne, Unique, PrimaryGeneratedColumn, Relation, OneToMany, ManyToOne } from "typeorm"
import { ShorebaseService } from "./ShorebaseService.js";
import { Company } from "../company/Company.js";
import { STComponent } from "../summaryTimesheet/STComponent.js";


@Entity()
export class ShorebaseServicePrice{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>ShorebaseService, (ss)=>ss.shorebaseServicePrices)
    shorebaseService: Relation<ShorebaseService>

    @ManyToOne(()=>Company, (company)=>company.shorebaseServicePrices)
    company: Relation<Company>

    @Column({type: `decimal`, precision: 22, scale:4})
    pricePerUom: number;

    @Column({type:`date`})
    startDate: string;

    @Column({type: `date`})
    endDate: string;

}
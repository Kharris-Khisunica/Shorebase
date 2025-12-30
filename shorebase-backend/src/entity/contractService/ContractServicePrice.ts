import { Entity, Column, PrimaryColumn, OneToOne, Unique, PrimaryGeneratedColumn, Relation, OneToMany, ManyToOne } from "typeorm"
import { ContractService } from "./ContractService.js";
import { STComponent } from "../summaryTimesheet/STComponent.js";

@Entity()
export class ContractServicePrice{

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => ContractService, (cs) => cs.contractServicePrices, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
    contractService: Relation<ContractService>

    @Column({type: `decimal`, precision:22, scale:4})
    pricePerUom: number

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date' })
    endDate: string;

}
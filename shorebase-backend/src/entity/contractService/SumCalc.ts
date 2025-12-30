import { Entity, Column, PrimaryColumn, OneToOne, Unique, PrimaryGeneratedColumn, Relation, OneToMany } from "typeorm"
import { ContractService } from "./ContractService.js"

@Entity()
export class SumCalc{
    
    @PrimaryColumn({type: `varchar`, length:255, unique:true})
    code: string

    @Column({type:`varchar`, length:255})
    name: string

    @OneToMany(()=> ContractService, (cs)=> cs.sumCalc)
    contractServices: Relation<ContractService[]>
    
}
import { Entity, Column, PrimaryColumn, OneToOne, Unique, PrimaryGeneratedColumn, Relation, OneToMany } from "typeorm"
import { ShorebaseService } from "./ShorebaseService.js"

@Entity()
export class ShorebaseServiceType{
    
    @PrimaryColumn({type: `varchar`, length:255, unique:true})
    code: string

    @Column({type:`varchar`, length:255})
    name: string

    @OneToMany(()=> ShorebaseService, (ss)=> ss.ssType)
    shorebaseService: Relation<ShorebaseService[]>
    
}
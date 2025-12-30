import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Activity } from "./Activity.js";
import { ActualActivityJetty } from "../actualActivity/ActualActivity-Jetty.js";

@Entity()
export class Ship{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length:255})
    code: string;

    @Column({type: 'varchar', length:255})
    name: string;

    @OneToMany(()=>ActualActivityJetty, (aaj)=>aaj.ship)
    aaJetty:Relation<ActualActivityJetty[]>

}
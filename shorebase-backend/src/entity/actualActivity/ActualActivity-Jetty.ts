import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation, ManyToOne } from "typeorm";
import { ActualActivity } from "./ActualActivity.js";
import { Ship } from "../activity/Ship.js";

@Entity()
export class ActualActivityJetty {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=>ActualActivity, (aa) => aa.actualActivityJetty)
    @JoinColumn()
    actualActivity: Relation<ActualActivity>;

    @Column({type: "datetime", nullable: true})
    actualStartedAt: string[]; // ?

    @Column({type: "datetime", nullable: true})
    actualEndedAt: string; 

    @ManyToOne(()=>Ship, (ship)=>ship.aaJetty)
    ship: Relation<Ship>

    @Column({type: "varchar", length: 255, nullable: true})
    actualJenisLayanan: string; // ? Operational / Standby. 
}
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation, ManyToOne } from "typeorm";
import { Ship } from "../activity/Ship.js";
import { PlanActivity } from "./PlanActivity.js";

@Entity()
export class PlanActivityJetty {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=>PlanActivity, (pa) => pa.planActivityJetty)
    @JoinColumn()
    planActivity: Relation<PlanActivity>;

    @Column({type: "datetime", nullable: true})
    planStartedAt: string; 

    @ManyToOne(()=>Ship, (ship)=>ship.aaJetty)
    ship: Relation<Ship>

    @Column({type: "varchar", length: 255, nullable: true})
    planJenisLayanan: string; // ? Operational / Standby. 
}
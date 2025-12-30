import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation } from "typeorm";
import { PlanActivity } from "./PlanActivity.js";


@Entity()
export class PlanActivityMeal {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=>PlanActivity, (pa) => pa.planActivityMeal)
    @JoinColumn()
    planActivity: Relation<PlanActivity>;

    @Column({type: "date", nullable: true})
    planStartDate: string; 

    @Column({type: "date", nullable: true})
    planEndDate: string; 

    @Column({type: "int", nullable: true})
    planPeopleCount: number; 

    @Column({type: "boolean", default: false})
    planBreakfast: boolean;

    @Column({type: "boolean", default: false})
    planLunch: boolean;

    @Column({type: "boolean", default: false})
    planDinner: boolean;
}
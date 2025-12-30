import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation } from "typeorm";
import { ActualActivity } from "./ActualActivity.js";


@Entity()
export class ActualActivityMeal {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=>ActualActivity, (aa) => aa.actualActivityMeal)
    @JoinColumn()
    actualActivity: Relation<ActualActivity>;

    @Column({type: "date", nullable: true})
    actualStartDate: string; 

    @Column({type: "date", nullable: true})
    actualEndDate: string; 

    @Column({type: "int", nullable: true})
    actualPeopleCount: number; 

    @Column({type: "boolean", default: false})
    actualBreakfast: boolean;

    @Column({type: "boolean", default: false})
    actualLunch: boolean;

    @Column({type: "boolean", default: false})
    actualDinner: boolean;
}
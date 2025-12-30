import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Activity } from "./Activity.js";
import { ActualActivityMH } from "../actualActivity/ActualActivity-MH.js";

@Entity()
export class Equipment{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length:255})
    code: string;

    @Column({type: 'varchar', length:255})
    name: string;

    @OneToMany(()=>ActualActivityMH, (aamh)=>aamh.equipment)
    actualActivitiesMH:Relation<ActualActivityMH[]>

    @OneToMany(()=>Activity, (activity)=>activity.equipment)
    activities: Relation<Activity[]>
}
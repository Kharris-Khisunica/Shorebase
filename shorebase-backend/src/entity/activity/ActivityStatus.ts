import { Entity, Column, PrimaryColumn, OneToOne, Unique, PrimaryGeneratedColumn, Relation, OneToMany, ManyToOne } from "typeorm"
import { Activity } from "./Activity.js";

@Entity()
export class ActivityStatus{

    @PrimaryColumn({type: 'varchar', length:255})
    code: string;

    @Column({type:'varchar', length:255})
    name: string;

    @OneToMany(()=>Activity, (activity)=>activity.activityStatus)
    activities: Relation<Activity[]>
}
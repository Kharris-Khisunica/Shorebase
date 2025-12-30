import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { UoM } from "./UoM.js";
import { Activity } from "../activity/Activity.js";
import { ActualActivityMH } from "../actualActivity/ActualActivity-MH.js";

@Entity()
export class ShorebaseServiceProduct{

    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(()=>ActualActivityMH, (aamh)=>aamh.actualProduct)
    actualActivitiesMH: Relation<ActualActivityMH[]>

    @OneToMany(()=>Activity, (activity)=>activity.shorebaseServiceProduct)
    activities: Relation<Activity[]>

    @Column({type: 'varchar', length:255})
    code: string;
    
    @Column({type: 'varchar', length:255})
    name: string;

    @ManyToOne(() => UoM, (uom)=>uom.shorebaseServiceProducts)
    uom: Relation<UoM>


}
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { ActualActivityAccomodation } from "../actualActivity/ActualActivity-Accomodation.js";
import { PlanActivityAccomodation } from "../planActivity/PlanActivity-Accomodation.js";

@Entity()
export class RoomType{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length:255})
    code: string;

    @Column({type: 'varchar', length:255})
    name: string;

    @OneToMany(()=>PlanActivityAccomodation, (pa)=>pa.planRoomType)
    planActivities:Relation<PlanActivityAccomodation[]>

    @OneToMany(()=>ActualActivityAccomodation, (aaa)=>aaa.actualRoomType)
    actualActivitiesAccomodation:Relation<ActualActivityAccomodation[]>

}
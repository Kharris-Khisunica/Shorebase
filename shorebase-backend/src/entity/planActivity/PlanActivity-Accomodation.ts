import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn, Relation, OneToMany } from "typeorm";
import { RoomType } from "../activity/RoomType.js";
import { PlanActivity } from "./PlanActivity.js";

@Entity()
export class PlanActivityAccomodation {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=>PlanActivity, (aa) => aa.planActivityAccomodation)
    @JoinColumn()
    planActivity: Relation<PlanActivity>;

    @Column({type:'datetime', nullable: true})
    planCheckIn: string;

    @Column({type:'datetime', nullable: true})
    planCheckOut: string;
    
    @Column({type:'integer', nullable: true})
    planRoomCount: number;

    @ManyToOne(()=>RoomType, (rt)=>rt.actualActivitiesAccomodation)
    planRoomType: Relation<RoomType>;
}
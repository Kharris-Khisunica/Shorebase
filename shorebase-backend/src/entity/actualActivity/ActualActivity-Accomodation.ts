import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn, Relation, OneToMany } from "typeorm";
import { RoomType } from "../activity/RoomType.js";
import { ActualActivity } from "./ActualActivity.js";

@Entity()
export class ActualActivityAccomodation {
    @PrimaryGeneratedColumn()
    id: number;

    // Link back to the main ActualActivity
    @OneToOne(()=>ActualActivity, (aa) => aa.actualActivityAccomodation)
    @JoinColumn()
    actualActivity: Relation<ActualActivity>;

    @Column({type:'datetime', nullable: true})
    actualCheckIn: string;

    @Column({type:'datetime', nullable: true})
    actualCheckOut: string;
    
    @Column({type:'integer', nullable: true})
    actualRoomCount: number;

    @ManyToOne(()=>RoomType, (rt)=>rt.actualActivitiesAccomodation)
    actualRoomType: Relation<RoomType>;
}
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm"
import { User } from "./User.js";
import { DateTime } from "luxon";
import { Approval } from "../approval/Approval.js";


@Entity()
export class UserSignature{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>User, (user)=>user.userSignatures)
    user: Relation<User>;

    @Column({type:'varchar', length:'1023'})
    fileUrl: string;

    @Column({type:'datetime'})
    startedAt: string;

    @Column({type:'datetime'})
    endedAt: string;


    @OneToMany(()=>Approval, (ap)=>ap.userSignature)
    approvals: Relation<Approval[]>
}
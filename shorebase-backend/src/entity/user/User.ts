import { Entity, Column, PrimaryColumn, OneToOne, Unique, PrimaryGeneratedColumn, Relation, OneToMany } from "typeorm"
import { UserPosition } from "./UserPosition.js";
import { UserSignature } from "./UserSignature.js";
import { Approval } from "../approval/Approval.js";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 255, unique: true })
    kcUserId: string

    @Column({ type: 'varchar', length: 255 })
    name: string

    @Column({ type: 'varchar', length: 255 })
    username: string

    @Column({ type: 'varchar', length: 255 })
    email: string

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date' })
    endDate: string;

    @OneToMany(() => UserPosition, (userPosition) => userPosition.user)
    userPositions: Relation<UserPosition[]>

    @OneToMany(()=>UserSignature, (us)=>us.user)
    userSignatures: Relation<UserSignature[]>

    @OneToMany(()=>Approval, (ap)=>ap.user)
    approvals: Relation<Approval[]>
}

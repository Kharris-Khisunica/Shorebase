import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm"
import { Approval } from "./Approval.js";


@Entity()
export class ApprovalStatus{
 
    @PrimaryColumn({type:`varchar`, length: 255})
    code: string;

    @Column({type:`varchar`, length: 255})
    name: string;

    @Column({type:'boolean'})
    pass: boolean; // Apakah lolos ke stage approval next nya
    
    @OneToMany(()=>Approval, (ta)=>ta.approvalStatus)
    approvals: Relation<Approval[]>
}
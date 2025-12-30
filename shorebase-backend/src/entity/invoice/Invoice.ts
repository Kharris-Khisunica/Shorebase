import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { PerformaInvoice } from "./PerformaInvoice.js";
import { Approval } from "../approval/Approval.js";

@Entity()
export class Invoice{

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=>PerformaInvoice, (pi)=>pi.invoice)
    performaInvoice: Relation<PerformaInvoice>

    @Column({type: 'varchar', length: 255})
    code: string;

    @Column({type:'date'})
    issueDate: string;

    @Column({type:'decimal', precision:22, scale:4})
    taxPercentage: number;

    @OneToMany(()=>Approval, (ap)=>ap.invoice)
    approvals: Relation<Approval[]>


}
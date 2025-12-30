import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { SummaryTimesheet } from "../summaryTimesheet/SummaryTimesheet.js";
import { Approval } from "../approval/Approval.js";
import { Invoice } from "./Invoice.js";

@Entity()
export class PerformaInvoice{

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=>SummaryTimesheet, (sts)=>sts.performaInvoice)
    summaryTimesheet: Relation<SummaryTimesheet>

    @Column({type: 'varchar', length: 255})
    code: string;

    @Column({type: 'date'})
    issueDate: string;

    @OneToMany(()=>Approval, (ap)=>ap.performaInvoice)
    approvals: Relation<Approval[]>

    @OneToOne(()=>Invoice, (invoice)=>invoice.performaInvoice)
    invoice: Relation<Invoice>

}
import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { STComponent } from "./STComponent.js";
import { Timesheet } from "../timesheet/Timesheet.js";


@Entity()
export class STTimesheet{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>STComponent, (stc)=>stc.sttimesheets)
    stComponent: Relation<STComponent>

    @OneToOne(()=>Timesheet, (ts)=>ts.sttimesheet)
    @JoinColumn()
    timesheet: Relation<Timesheet>
}
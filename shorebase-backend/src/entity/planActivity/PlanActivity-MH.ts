import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn, Relation } from "typeorm";
import { ShorebaseServiceProduct } from "../contractService/ShorebaseServiceProduct.js";
import { Equipment } from "../activity/Equipment.js";
import { PlanActivity } from "./PlanActivity.js";

@Entity()
export class PlanActivityMH {
    @PrimaryGeneratedColumn()
    id: number;

    // Link back to the main ActualActivity
    @OneToOne(()=>PlanActivity, (pa) => pa.planActivityMH)
    @JoinColumn()
    planActivity: Relation<PlanActivity>;

    @Column({type:'date', nullable: true})
    planStartDate: string;

    @ManyToOne(() => ShorebaseServiceProduct, (ssp)=>ssp.actualActivitiesMH)
    planProduct: Relation<ShorebaseServiceProduct>;

    @Column({type:'integer', nullable: true})
    planProductQty: number;
}
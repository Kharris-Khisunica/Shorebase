import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn, Relation } from "typeorm";
import { ShorebaseServiceProduct } from "../contractService/ShorebaseServiceProduct.js";
import { Equipment } from "../activity/Equipment.js";
import { ActualActivity } from "./ActualActivity.js";

@Entity()
export class ActualActivityMH {
    @PrimaryGeneratedColumn()
    id: number;

    // Link back to the main ActualActivity
    @OneToOne(()=>ActualActivity, (aa) => aa.actualActivityMH)
    @JoinColumn()
    actualActivity: Relation<ActualActivity>;

    @Column({type:'double', nullable: true})
    actualAmount: number;

    @Column({type:'datetime', nullable: true})
    actualStartedAt: string;

    @Column({type:'datetime', nullable: true})
    actualEndedAt: string;
    
    @Column({type:'varchar', length:1023, nullable: true})
    actualDescription: string;

    @ManyToOne(() => ShorebaseServiceProduct, (ssp)=>ssp.actualActivitiesMH)
    actualProduct: Relation<ShorebaseServiceProduct>;

    @Column({type:'integer', nullable: true})
    actualProductQty: number;

    @ManyToOne(() => Equipment, (eq)=>eq.actualActivitiesMH)
    equipment: Relation<Equipment>;
}
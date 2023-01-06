import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { Addresses } from "./addresses";
import { Categories } from "./categories";
import { Schedules } from "./schedules_user_properties";

@Entity("properties")
export class Properties {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({
        default: false,
    })
    sold: boolean;
    @Column("decimal", { precision: 12, scale: 2 })
    value: number;

    @Column()
    size: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => Addresses)
    @JoinColumn()
    address: Addresses;

    @ManyToOne(() => Categories, (category) => category.property)
    category: Categories;

    @OneToMany(() => Schedules, (schedule) => schedule.property)
    schedules: Schedules[];
}

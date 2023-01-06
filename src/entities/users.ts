import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { hashSync } from "bcryptjs";
import { Schedules } from "./schedules_user_properties";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    password: string;

    @Column()
    isAdm: boolean;

    @Column({
        default: true,
    })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @BeforeInsert()
    hashPassword() {
        this.password = hashSync(this.password, 10);
    }

    @OneToMany(() => Schedules, (schedule) => schedule.user)
    schedules: Schedules;
}

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Properties } from "./properties";
import { User } from "./users";

@Entity("schedules_user_properties")
export class Schedules {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "date" })
    date: string;

    @Column()
    hour: string;

    @ManyToOne(() => Properties, (property) => property.schedules)
    properties: Properties;

    @ManyToOne(() => User, (user) => user.schedules)
    user: User;
}

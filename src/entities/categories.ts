import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Properties } from "./properties";

@Entity("categories")
export class Categories {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => Properties, (properties) => properties.category)
    properties: Properties[];
}

import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column({length: 30})
    password: string;

    @Column({length: 50})
    firstName: string;

    @Column({length: 50})
    lastName: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    timestamp: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    lastActivity: string;

    @Column({length: 5, default: 'other'})
    type: string;

    @Column()
    token: string;
}
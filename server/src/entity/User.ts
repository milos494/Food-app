import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from 'typeorm';
import { Recipes } from './Recipes';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column({ unique: true })
	username: string;

	@Column({ length: 50 })
	firstName: string;

	@Column({ length: 50 })
	lastName: string;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	timestamp: string;

	@Column({ length: 5, default: 'other' })
	type: string;

	@Column()
	token: string;

	@Column({ default: true })
	enabled: boolean;

	@OneToMany(
		type => Recipes,
		recipe => recipe.user,
	)
	recipes: Recipes[];
}

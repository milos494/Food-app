import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Recipes } from './Recipes';
import { Ingredients } from './Ingredients';
import { Ratings } from './Ratings';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	readonly id: number;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

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

	@OneToMany(
		type => Ingredients,
		ingredient => ingredient.user,
	)
	ingredients: Ingredients[];

	@OneToMany(
		type => Ratings,
		rating => rating.user,
	)
	ratings: Ratings[];
}

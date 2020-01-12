import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToOne,
} from 'typeorm';
import { RecipeIngredients } from './RecipesIngredients';
import { User } from './User';
import { Ratings } from './Ratings';

@Entity()
export class Recipes {
	@PrimaryGeneratedColumn()
	readonly id: number;

	@Column({ length: 100 })
	name: string;

	@ManyToOne(
		type => User,
		user => user.recipes,
	)
	user: User;

	@Column({ length: 10000 })
	description: string;

	@Column({ length: 10000 })
	preparation: string;

	@Column({ default: 100 })
	preparationTime: number;

	@Column({ default: 4 })
	numberOfPersons: number;

	@Column({ length: 100 })
	image: string;

	@OneToMany(
		type => RecipeIngredients,
		recipeIngerdient => recipeIngerdient.recipe,
	)
	recipeIngredients: RecipeIngredients[];

	@OneToMany(
		type => Ratings,
		rating => rating.recipe,
	)
	ratings: Ratings[];
}

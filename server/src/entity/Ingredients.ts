import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToMany,
	ManyToOne,
} from 'typeorm';
import { RecipeIngredients } from './RecipesIngredients';
import { User } from './User';

@Entity()
export class Ingredients {
	@PrimaryGeneratedColumn()
	readonly id: number;

	@Column({ length: 100, unique: true })
	name: string;

	@Column({ length: 30 })
	unitOfMeasure: string;

	@Column({ length: 100 })
	image: string;

	@Column({ default: false })
	validatedByAdmin: boolean;

	@Column({ default: '' })
	description: string;

	@OneToMany(
		type => RecipeIngredients,
		recipeIngredient => recipeIngredient.ingredient,
	)
	recipeIngredients: RecipeIngredients[];

	@ManyToOne(
		type => User,
		user => user.ingredients,
	)
	user: User;
}

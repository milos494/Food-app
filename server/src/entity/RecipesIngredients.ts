import {
	Entity,
	Column,
	ManyToOne,
	PrimaryGeneratedColumn,
	Index,
} from 'typeorm';
import { Recipes } from './Recipes';
import { Ingredients } from './Ingredients';

@Entity()
@Index(
	(relation: RecipeIngredients) => [relation.recipe, relation.ingredient],
	{
		unique: true,
	},
)
export class RecipeIngredients {
	@PrimaryGeneratedColumn()
	readonly id: number;

	@ManyToOne(
		type => Recipes,
		recipe => recipe.recipeIngredients,
	)
	recipe: Recipes;

	@ManyToOne(
		type => Ingredients,
		ingredient => ingredient.recipeIngredients,
	)
	ingredient: Ingredients;

	@Column()
	amount: number;
}

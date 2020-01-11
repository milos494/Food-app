import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipes } from './Recipes';
import { Ingredients } from './Ingredients';

@Entity()
export class RecipeIngredients {
	@PrimaryGeneratedColumn()
	id: number;

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

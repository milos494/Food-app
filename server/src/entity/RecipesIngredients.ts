import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipes } from "./Recipes";
import { Ingredients } from "./Ingredients";

@Entity()
export class RecipeIngredients {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Recipes, recipe => recipe.recipeIngredients)
  recipe: number;

  @ManyToOne(type => Ingredients, ingredient => ingredient.recipeIngredients)
  ingredient: number;

  @Column()
  amount: number;
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RecipeIngredients } from "./RecipesIngredients";

@Entity()
export class Ingredients {

  // @OneToMany(type => RecipeIngredients, recipeIngredient => recipeIngredient.ingredientId)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 30 })
  unitOfMeasure: string;

  @Column({ length: 100 })
  image: string;

  @OneToMany(type => RecipeIngredients, recipeIngredient => recipeIngredient.ingredient)
  recipeIngredients: RecipeIngredients[];
}

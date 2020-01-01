import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { RecipeIngredients } from "./RecipesIngredients";
import { User } from "./User";
import { Ratings } from "./Ratings";

@Entity()
export class Recipes {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(type => User, user => user.recipes)
  user: number;

  @Column({ length: 10000 })
  preparation: string;

  @Column({ length: 100 })
  image: string;

  @OneToMany(type => RecipeIngredients, recipeIngerdient => recipeIngerdient.recipe)
  recipeIngredients: RecipeIngredients[];

  @OneToMany(type => Ratings, rating => rating.recipe)
  ratings: Ratings[];
}

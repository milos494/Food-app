import { Entity, Column, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipes } from "./Recipes";

@Entity()
export class Ratings {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  rating: number;

  @ManyToOne(type => Recipes, recipe => recipe.ratings)
  recipe: Recipes;
}

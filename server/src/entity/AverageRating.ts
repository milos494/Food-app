import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Recipes } from "./Recipes";

@Entity()
export class AverageRating {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numberOfVoters: string;

  @Column('double')
  averageRating: number;

  @OneToOne(type => Recipes)
  @JoinColumn()
  recipe: Recipes;
}

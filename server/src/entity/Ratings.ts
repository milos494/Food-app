import {
	Entity,
	Column,
	PrimaryColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Index,
} from 'typeorm';
import { Recipes } from './Recipes';
import { User } from './User';

@Entity()
@Index((relation: Ratings) => [relation.user, relation.recipe], {
	unique: true,
})
export class Ratings {
	@PrimaryGeneratedColumn()
	readonly id: number;

	@ManyToOne(
		type => User,
		user => user.ratings,
	)
	user: User;

	@Column()
	rating: number;

	@ManyToOne(
		type => Recipes,
		recipe => recipe.ratings,
	)
	recipe: Recipes;
}

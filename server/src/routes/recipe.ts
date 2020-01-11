import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository, createQueryBuilder } from 'typeorm';
import { authentication } from '../middleware/authentication';
import { Recipes } from '../entity/Recipes';
import { RecipeIngredients } from '../entity/RecipesIngredients';
import { User } from '../entity/User';
import { Ingredients } from '../entity/Ingredients';

const recipe = () => {
	const router = express.Router();

	router.get('/', async (req, res) => {
		const recipeRepository = getRepository(Recipes);
		const ingredientsRecipesRepository = getRepository(RecipeIngredients);
		const { ingredients } = req.query;

		try {
			let recipes;
			if (!ingredients) {
				recipes = await recipeRepository.find();
			} else {
				// const recipeIngredient = ingredientsRecipesRepository.createQueryBuilder('rc').where(
				//   'rc.ingredientId'
				// )
				recipes = [];
				for (const ingredientId of ingredients) {
					const allRecipes = await recipeRepository
						.createQueryBuilder('recipes')
						.leftJoinAndSelect(
							'recipes.recipeIngredients',
							'recipe_ingredients',
						)
						.where('recipe_ingredients.ingredientId = :ingredientId', {
							ingredientId,
						})
						.getMany();
					if (!recipes.length) {
						recipes = allRecipes;
						console.log('usao tu ***********');
						console.log(allRecipes);
					} else {
						console.log('usao else ***********');
						console.log(allRecipes);
						recipes = recipes.filter(recipe => {
							const x = allRecipes.findIndex(r => r.id === recipe.id);
							console.log(']]]]]]]]]]]]]]]]]]]]]]]]]]]]]]');
							console.log(x);
							return x !== -1;
						});
					}
				}
				console.log('*//////////////////////////////////');
				console.log(recipes);
			}
			res.send({ data: { recipes, code: 200 } });
		} catch (e) {
			console.log(e);
			res.status(400).send();
		}
	});

	router.get('/:id', async (req, res) => {
		const recipeRepository = getRepository(Recipes);
		const { id } = req.params;

		try {
			const recipe = await recipeRepository.findOne(id);
			res.send({ data: { recipe, code: 200 } });
		} catch (e) {
			res.status(400).send();
		}
	});

	router.post('/', authentication, async (req, res) => {
		console.log('usao sam tu');
		let {
			name,
			preparation,
			ingredients,
			image,
			description,
			prearationTime,
			numberOfPersons,
		} = req.body;
		const recipeRepository = getRepository(Recipes);
		const ingredientsRecipesRepository = getRepository(RecipeIngredients);
		const IngredientRepository = getRepository(Ingredients);
		const userRepository = getRepository(User);
		const recipe = new Recipes();
		const ingredientRecipe = new RecipeIngredients();

		try {
			const user: User = await userRepository
				.createQueryBuilder('user')
				.where('user.id = :id', { id: req.body.userId })
				.getOne();
			console.log('sam tu');
			console.log(user);
			recipe.name = name;
			recipe.preparation = preparation;
			recipe.image = image;
			recipe.user = user;
			recipe.description = description;
			if (numberOfPersons) {
				recipe.numberOfPersons = numberOfPersons;
			}
			if (prearationTime) {
				recipe.preparationTime = prearationTime;
			}
			await recipeRepository.save(recipe);

			ingredientRecipe.recipe = recipe;
			Object.keys(ingredients).forEach(async ingredientId => {
				const ingredient: Ingredients = await IngredientRepository.createQueryBuilder(
					'ingredients',
				)
					.where('ingredients.id = :id', { id: ingredientId })
					.getOne();
				ingredientRecipe.ingredient = ingredient;
				ingredientRecipe.amount = ingredients[ingredientId];
				await ingredientsRecipesRepository.save(ingredientRecipe);
			});

			res.send({
				data: { message: 'Recipe successfully created!', code: 201 },
			});
		} catch (e) {
			res.status(400).send();
		}
	});

	router.put('/:id', authentication, async (req, res) => {});

	router.delete('/:id', authentication, async (req, res) => {});

	return router;
};

export default recipe();

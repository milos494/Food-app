import * as express from 'express';
import { getRepository } from 'typeorm';
import { authentication } from '../middleware/authentication';
import { Recipes } from '../entity/Recipes';
import { RecipeIngredients } from '../entity/RecipesIngredients';
import { Ingredients } from '../entity/Ingredients';
import { request } from '../types';

const recipe = () => {
	const router = express.Router();

	router.get('/', async (req, res) => {
		const recipeRepository = getRepository(Recipes);
		const { ingredients } = req.query;

		try {
			let recipes;
			if (!ingredients) {
				recipes = await recipeRepository.find();
			} else {
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
					} else {
						recipes = recipes.filter(recipe => {
							const x = allRecipes.findIndex(r => r.id === recipe.id);
							return x !== -1;
						});
					}
				}
			}
			res.status(200);
			res.send({ data: { recipes, code: 200 } });
		} catch (e) {
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

	router.post('/', authentication, async (req: request, res) => {
		let {
			name,
			preparation,
			ingredients,
			image,
			description,
			prearationTime,
			numberOfPersons,
		} = req.body;
		const { user } = req;

		const recipeRepository = getRepository(Recipes);
		const ingredientsRecipesRepository = getRepository(RecipeIngredients);
		const IngredientRepository = getRepository(Ingredients);

		const recipe = new Recipes();
		const ingredientRecipe = new RecipeIngredients();

		try {
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

			res.status(201);
			res.send({
				data: { message: 'Recipe successfully created!', code: 201 },
			});
		} catch (e) {
			res.status(400).send();
		}
	});

	router.put('/:id', authentication, async (req: request, res) => {
		const recipeRepository = getRepository(Recipes);
		const { user } = req;
		const { id } = req.params;
		const {
			name,
			description,
			preparation,
			preparationTime,
			numberOfPersons,
			image,
		} = req.body;

		try {
			const recipe = await recipeRepository
				.createQueryBuilder('recipe')
				.leftJoinAndSelect('recipe.user', 'user')
				.where('recipe.id = :id', { id })
				.getOne();
			if (!recipe) {
				res.status(404);
				res.send({ data: { message: 'Recipe not found', code: 404 } });
				return;
			}

			if (recipe.user.id !== user.id && user.type !== 'admin') {
				res.status(403);
				res.send({
					data: {
						message: 'Recipe can be changed only by creator or admin!',
						code: 403,
					},
				});
				return;
			}

			if (name) {
				recipe.name = name;
			}

			if (description) {
				recipe.description = description;
			}

			if (preparation) {
				recipe.preparation = preparation;
			}

			if (preparationTime) {
				recipe.preparationTime = preparationTime;
			}

			if (numberOfPersons) {
				recipe.numberOfPersons = numberOfPersons;
			}

			if (image) {
				recipe.image = image;
			}

			await recipeRepository.save(recipe);

			res.status(200);
			res.send({
				data: { message: 'Recipe successfully updated!', code: 200 },
			});
		} catch (e) {
			res.status(400).send();
		}
	});

	router.delete('/:id', authentication, async (req: request, res) => {
		const recipeRepository = getRepository(Recipes);
		const { user } = req;
		const { id } = req.params;

		if (user.type !== 'admin') {
			res.status(403);
			res.send({ data: { message: 'Recipe can be deleted only by admin!' } });
			return;
		}

		try {
			await recipeRepository.delete(id);
			res.status(200);
			res.send({
				data: { message: 'Recipe successfully deleted!', code: 200 },
			});
		} catch (e) {
			res.status(400).send();
		}
	});

	return router;
};

export default recipe();

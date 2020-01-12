import * as express from 'express';
import { getRepository } from 'typeorm';
import { authentication } from '../middleware/authentication';
import { Ratings } from '../entity/Ratings';
import { Recipes } from '../entity/Recipes';
import { request } from '../types';

const rating = () => {
	const router = express.Router();

	router.get('/:id', authentication, async (req: request, res) => {
		const ratingRepository = getRepository(Ratings);
		const recipeRepository = getRepository(Recipes);
		const { id } = req.params;
		const { user } = req;

		try {
			const recipe: Recipes = await recipeRepository.findOne(id);
			const rating: Ratings = await ratingRepository.findOne({ recipe, user });

			res.status(200);
			res.send({ data: { rating: rating.rating, code: 200 } });
		} catch (e) {
			res.status(400).send();
		}
	});

	router.post('/:id', authentication, async (req: request, res) => {
		const ratingRepository = getRepository(Ratings);
		const recipeRepository = getRepository(Recipes);
		const { id } = req.params;
		const { rating } = req.body;
		const { user } = req;
		const userRating = new Ratings();

		try {
			const recipe: Recipes = await recipeRepository.findOne(id);
			userRating.recipe = recipe;
			userRating.user = user;
			userRating.rating = rating;

			await ratingRepository.save(userRating);

			res.status(200);
			res.send({
				data: { message: 'Rating successfully saved!', code: 200 },
			});
		} catch (e) {
			if (e.sqlState === 23000) {
				res.status(403);
				res.send({
					data: { message: 'Rating alredy exists, use PUT!', code: 403 },
				});
				return;
			}
			res.status(400).send();
		}
	});

	router.put('/:id', authentication, async (req: request, res) => {
		const ratingRepository = getRepository(Ratings);
		const recipeRepository = getRepository(Recipes);

		const { id } = req.params;
		const { rating } = req.body;
		const { user } = req;

		try {
			const recipe: Recipes = await recipeRepository.findOne(id);

			await ratingRepository.update({ user, recipe }, { rating });

			res.status(200);
			res.send({
				data: { message: 'Rating successfully updated!', code: 200 },
			});
		} catch (e) {
			res.status(400).send();
		}
	});

	return router;
};

export default rating();

import * as express from 'express';
import { getRepository } from 'typeorm';
import { authentication } from '../middleware/authentication';
import { Ingredients } from '../entity/Ingredients';
import { request } from '../types';

const recipe = () => {
	const router = express.Router();

	router.get('/', async (req, res) => {
		const ingredientRepository = getRepository(Ingredients);

		try {
			const ingredients = await ingredientRepository.find();

			res.status(200);
			res.send({ data: { ingredients, code: 200 } });
		} catch (e) {
			res.status(400).send();
		}
	});

	router.get('/:id', async (req, res) => {
		const ingredientRepository = getRepository(Ingredients);
		const { id } = req.params;

		try {
			const ingredient = await ingredientRepository.findOne(id);

			res.status(200);
			res.send({ data: { ingredient, code: 200 } });
		} catch (e) {
			res.status(400).send();
		}
	});

	router.post('/', authentication, async (req: request, res) => {
		const { name, unitOfMeasure, image, description } = req.body;
		const { user } = req;
		const ingredientRepository = getRepository(Ingredients);
		const ingredient = new Ingredients();

		try {
			ingredient.name = name;
			ingredient.unitOfMeasure = unitOfMeasure;
			ingredient.image = image;
			if (user.type === 'admin') {
				ingredient.validatedByAdmin = true;
			}
			if (description) {
				ingredient.description = description;
			}
			ingredient.user = user;

			await ingredientRepository.save(ingredient);

			res.status(201);
			res.send({
				data: { message: 'Ingredient successfully created!', code: 201 },
			});
		} catch (e) {
			res.status(400).send();
		}
	});

	router.put('/:id', authentication, async (req: request, res) => {
		const { name, unitOfMeasure, image, description, validated } = req.body;
		const { id } = req.params;
		const { user } = req;

		const ingredientRepository = getRepository(Ingredients);

		if (user.type !== 'admin') {
			res.status(403);
			res.send({
				data: { message: 'Only admin can change ingredients!', code: 403 },
			});
			return;
		}

		try {
			if (name) {
				await ingredientRepository.update(id, { name });
			}

			if (unitOfMeasure) {
				await ingredientRepository.update(id, { unitOfMeasure });
			}

			if (image) {
				await ingredientRepository.update(id, { image });
			}

			if (description) {
				await ingredientRepository.update(id, { description });
			}

			if (validated) {
				await ingredientRepository.update(id, { validatedByAdmin: validated });
			}

			res.status(200);
			res.send({
				data: { message: 'Ingredient successfully updated', code: 200 },
			});
		} catch (e) {
			res.status(400).send();
		}
	});

	return router;
};

export default recipe();

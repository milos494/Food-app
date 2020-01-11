import * as express from 'express';
import { getRepository } from 'typeorm';
import { authentication } from '../middleware/authentication';
import { User } from '../entity/User';
import { Ingredients } from '../entity/Ingredients';

const recipe = () => {
	const router = express.Router();

	router.get('/', async (req, res) => {
		const ingredientRepository = getRepository(Ingredients);

		try {
			const ingredients = await ingredientRepository.find();

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

			res.send({ data: { ingredient, code: 200 } });
		} catch (e) {
			res.status(400).send();
		}
	});

	router.post('/', authentication, async (req, res) => {
		const { name, unitOfMeasure, image, description } = req.body;
		const { id, type } = req.body.userData;
		const userRepository = getRepository(User);
		const ingredientRepository = getRepository(Ingredients);
		const ingredient = new Ingredients();

		try {
			const user: User = await userRepository
				.createQueryBuilder('user')
				.where('user.id = :id', { id })
				.getOne();
			ingredient.name = name;
			ingredient.unitOfMeasure = unitOfMeasure;
			ingredient.image = image;
			if (type === 'admin') {
				ingredient.validatedByAdmin = true;
			}
			if (description) {
				ingredient.description = description;
			}
			ingredient.user = user;

			await ingredientRepository.save(ingredient);
			res.send({
				data: { message: 'Ingredient successfully created!', code: 201 },
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

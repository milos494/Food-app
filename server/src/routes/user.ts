import * as express from 'express';
import * as bcrypt from 'bcryptjs';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import { authentication } from '../middleware/authentication';
import { request } from '../types';

const user = () => {
	const router = express.Router();

	router.get('/:id', async (req, res) => {
		const userRepository = getRepository(User);
		const { id } = req.params;

		try {
			const user: User = await userRepository.findOne(id);
			res.status(200);
			res.send({
				data: {
					user: {
						firstName: user.firstName,
						lastName: user.lastName,
						timestamp: user.timestamp,
						enabled: user.enabled,
					},
					code: 200,
				},
			});
		} catch (e) {
			res.status(400).send();
		}
	});

	router.get('/', authentication, async (req: request, res) => {
		const { user } = req;

		res.status(200);
		res.send({
			data: {
				user: {
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					timestamp: user.timestamp,
					enabled: user.enabled,
				},
				code: 200,
			},
		});
	});

	router.post('/', async (req, res) => {
		const userRepository = getRepository(User);
		let { email, password, firstName, lastName } = req.body;

		if (!email || !password || !firstName || !lastName) {
			res.status(400);
			res.send({ data: { message: 'Some parameter is missing!', code: 400 } });
			return;
		}

		password = bcrypt.hashSync(password, 10);
		try {
			await userRepository.insert({
				email,
				password,
				firstName,
				lastName,
				token: '123456789',
			});

			res.status(201);
			res.send({ data: { message: 'User successfully created', code: 201 } });
		} catch (e) {
			if (e.sqlState === '23000') {
				res.status(403);
				res.send({ data: { message: 'User already exists', code: 403 } });
				return;
			}
			res.status(400).send();
		}
	});

	router.put('/', authentication, async (req: request, res) => {
		const userRepository = getRepository(User);
		const { id } = req.user;
		const { firstName, lastName, password } = req.body;

		try {
			if (firstName) {
				await userRepository.update({ id }, { firstName });
			}

			if (lastName) {
				await userRepository.update({ id }, { lastName });
			}

			if (password) {
				const newPassword = bcrypt.hashSync(password, 10);
				await userRepository.update({ id }, { password: newPassword });
			}

			res.status(200);
			res.send({ data: { message: 'User successfully updated', code: 200 } });
		} catch (e) {
			res.status(400).send();
		}
	});

	router.delete('/', authentication, async (req: request, res) => {
		const { id } = req.user;
		const userRepository = getRepository(User);

		try {
			await userRepository.update({ id }, { enabled: false });
			res.status(200);
			res.send({ data: { message: 'User successfully deleted', code: 200 } });
		} catch (e) {
			res.status(400).send();
		}
	});

	return router;
};

export default user();

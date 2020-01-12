import * as express from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import { authentication } from '../middleware/authentication';
import { request } from '../types';

const logInOut = () => {
	const router = express.Router();

	router.put('/login', async (req, res) => {
		const userRepository = getRepository(User);
		let { email, password } = req.body;

		try {
			const userResponse = await userRepository
				.createQueryBuilder('user')
				.where('user.email = :email', { email })
				.getOne();

			if (!userResponse) {
				res.send({ data: { message: 'User not found', code: 404 } });
				return;
			}

			bcrypt.compare(password, userResponse.password, async (err, result) => {
				if (result) {
					const token = jwt.sign({ id: userResponse.id }, 'kjkszpj').toString();
					await userRepository.update({ id: userResponse.id }, { token });

					res.status(200);
					res.send({
						data: {
							token,
							message: 'User has been successfully logged in',
							code: 200,
						},
					});
				} else {
					res.status(403);
					res.send({ data: { message: 'Wrong password!', code: 403 } });
				}
			});
		} catch (e) {
			res.status(400).send();
		}
	});

	router.put('/logout', authentication, async (req: request, res) => {
		const userRepository = getRepository(User);
		const { id } = req.user;

		try {
			const token = '';
			await userRepository.update({ id }, { token });

			res.status(200);
			res.send({ data: { message: 'User has been logged out', code: 200 } });
		} catch (e) {
			res.status(400).send();
		}
	});

	return router;
};

export default logInOut();

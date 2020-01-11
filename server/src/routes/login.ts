import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import { authentication } from '../middleware/authentication';

const authenticate = () => {
	const router = express.Router();

	router.put('/login', async (req, res) => {
		const userRepository = getRepository(User);
		let { email, password } = req.body;

		try {
			const userResponse = await userRepository
				.createQueryBuilder('user')
				.where('user.email = :email', { email })
				.getOne();
			console.log('user found', userResponse, email, password);
			if (!userResponse) {
				res.send({ data: { message: 'User not found', code: 404 } });
			}

			const token = jwt.sign({ id: userResponse.id }, 'kjkszpj').toString();
			console.log(token, '{++++++++++++++++++++++++++++');
			await userRepository.update({ id: userResponse.id }, { token });

			res.send({
				data: {
					token,
					username: userResponse.username,
					message: 'User has been successfully logged in',
					code: 200,
				},
			});
		} catch (e) {
			console.log('error', e);
			res.status(500).send();
		}
	});

	router.put('/logout/:username', authentication, async (req, res) => {
		const userRepository = getRepository(User);
    const { username } = req.params;

		try {
			const token = '';
			await userRepository.update({ username }, { token });

			res.send({ data: { message: 'User has been logged out', code: 200 } });
		} catch (e) {
			console.log('error', e);
			res.status(500).send();
		}
	});

	return router;
};

export default authenticate();

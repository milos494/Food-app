import * as express from 'express';
import * as bcrypt from 'bcryptjs';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import { authentication } from '../middleware/authentication';

const user = () => {
	const router = express.Router();

	router.post('/', async (req, res) => {
		const userRepository = getRepository(User);
		let { email, password, firstName, lastName, username } = req.body;

		password = bcrypt.hashSync(password, 10);
		try {
			await userRepository.insert({
				email,
				password,
				firstName,
				lastName,
				username,
				type: 'other',
				token: '123456',
			});

			res.send({ data: { message: 'User successfully created', code: 201 } });
		} catch (e) {
			console.log(e);
			if (e.sqlState === '23000') {
				res.send({ data: { message: 'User already exists', code: 400 } });
			}
			res.status(500).send();
		}
	});

	router.put('/:username', authentication, async (req, res) => {
		const userRepository = getRepository(User);
		const { username } = req.params;
		const { firstName, lastName, password } = req.body;

		try {
			if (firstName) {
				await userRepository.update({ username }, { firstName });
				res.send({ data: { message: 'User successfully updated' } });
			}

			if (lastName) {
				await userRepository.update({ username }, { lastName });
				res.send({ data: { message: 'User successfully updated' } });
			}

			if (password) {
				const newPassword = bcrypt.hashSync(password, 10);
				await userRepository.update({ username }, { password: newPassword });
				res.send({ data: { message: 'User successfully updated' } });
			}
		} catch (e) {
			res.status(400).send();
		}
	});

	router.delete('/:username', authentication, async (req, res) => {
		const { username } = req.params;
		const userRepository = getRepository(User);

		try {
			await userRepository.update({ username }, { enabled: false });
			res.send({ data: { message: 'User successfully deleted' } });
		} catch (e) {
			res.status(400).send();
		}
	});

	return router;
};

export default user();

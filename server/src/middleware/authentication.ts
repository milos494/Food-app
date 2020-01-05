import { User } from '../entity/User';
import { getRepository } from 'typeorm';

export const authentication = async (req, res, next) => {
	const token = req.header('x-auth');
	const userRepository = getRepository(User);

	try {
		const user = await userRepository
			.createQueryBuilder('user')
			.where('user.token = :token', { token })
			.execute();

		if (!user) {
			return Promise.reject();
		}

		req.user = user;
		next();
	} catch (e) {
		console.log(e);
		res.status(401).send();
	}
};

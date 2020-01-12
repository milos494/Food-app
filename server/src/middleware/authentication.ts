import { User } from '../entity/User';
import { getRepository } from 'typeorm';

export const authentication = async (req, res, next) => {
	const token = req.header('x-auth');
	const userRepository = getRepository(User);

	try {
		const user = await userRepository
			.createQueryBuilder('user')
			.where('user.token = :token', { token })
			.getOne();

		if (!user) {
			throw new Error("User doesn't exist!");
		}

		req.user = user;
		next();
	} catch (e) {
		res.status(401).send();
	}
};

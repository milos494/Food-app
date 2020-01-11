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

		console.log(user, '******************************');
		if (!user) {
			throw new Error("User doesn't exist!");
		}

		req.body.userData = {};
		req.body.userData.id = user.id;
		req.body.userData.type = user.type;
		next();
	} catch (e) {
		console.log(e);
		res.status(401).send();
	}
};

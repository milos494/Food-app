import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import user from './routes/user';
import logInOut from './routes/login';
import recipe from './routes/recipe';
import ingredient from './routes/ingredient';
import rating from './routes/rating';

createConnection()
	.then(connection => {
		let app = express();

		app.use(bodyParser.json());

		app.use('/user', user);
		app.use('/authenticate', logInOut);
		app.use('/recipe', recipe);
		app.use('/ingredient', ingredient);
		app.use('/rating', rating);

		app.listen(3000, () => {
			console.log('Started on port 3000!');
		});
	})
	.catch(error => console.error(error));

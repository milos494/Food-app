import * as express from 'express';
import { User } from './entity/User';

export type request = express.Request & { user: User };

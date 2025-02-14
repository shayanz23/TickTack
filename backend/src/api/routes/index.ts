import express from 'express';

import { usersRoute } from './users.js';
import { gamesRoute } from './games.js';

export const routes = express.Router();

routes.use(usersRoute);

routes.use(gamesRoute);
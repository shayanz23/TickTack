import express from 'express';

import * as controller from '../controllers/users.js';

export const usersRoute = express.Router();
const routeUri = "/api/v1/users";


usersRoute.get(routeUri + "/:id", controller.getUserById);

usersRoute.get(routeUri + "/:id/games/", controller.getGamesByUserId);

usersRoute.delete(routeUri + "/:id", controller.deleteUser);

usersRoute.patch(routeUri + "/:id", controller.editUser);

usersRoute.post(routeUri, controller.createUser);

usersRoute.post(routeUri + "/login", controller.logIn);

// admin
usersRoute.get(routeUri, controller.getAllUsers);

// usersRoute.get("/switch", controller.switche)
// usersRoute.get("/notswitch", controller.notswitche)
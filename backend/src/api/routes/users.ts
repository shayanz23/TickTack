import express from "express";
import "dotenv/config";

import * as controller from '../controllers/users.js';
import { verifyJwt, verifyAdminJwt } from "../middlewares/verification.js";

export const usersRoute = express.Router();

const routeUri = process.env.API_URI_V1 + "/users";

usersRoute.get(routeUri + "/:id", verifyJwt, controller.getUserById);

usersRoute.get(routeUri + "/:id/games", verifyJwt, controller.getGamesByUserId);

usersRoute.delete(routeUri + "/:id", verifyJwt, controller.deleteUser);

usersRoute.patch(routeUri + "/:id", verifyJwt, controller.editUser);

usersRoute.post(routeUri, verifyJwt, controller.createUser);

usersRoute.post(routeUri + "/login", controller.logIn);

// admin
const adminRouteUri = process.env.ADMIN_API_URI_V1 + "/users";

usersRoute.get(adminRouteUri, verifyAdminJwt, controller.getAllUsers);
import express from "express";
import "dotenv/config";

import * as controller from "../controllers/games.js";
import { verifyAdminJwt, verifyJwt } from "../middlewares/verification.js";

export const gamesRoute = express.Router();

const routeUri = process.env.API_URI_V1 + "/games";

gamesRoute.get(routeUri + "/:id", verifyJwt, controller.getGame);

gamesRoute.get(routeUri + "/:id/winner", verifyJwt, controller.getWinner);

gamesRoute.get(routeUri + "/:id/users", verifyJwt, controller.getUsersByGameId);

gamesRoute.post(routeUri, verifyJwt, controller.createGame);


//Admin routes
const adminRouteUri = process.env.ADMIN_API_URI_V1 + "/games";

gamesRoute.get(adminRouteUri, verifyAdminJwt, controller.getAllGames);
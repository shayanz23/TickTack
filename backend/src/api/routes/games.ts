import express from "express";

import * as controller from "../controllers/games.js";

export const gamesRoute = express.Router();
const routeUri = "/api/v1/games";

gamesRoute.get(routeUri, controller.getGames);

gamesRoute.get(routeUri + "/:id", controller.getGame);

gamesRoute.get(routeUri + "/:id/winner", controller.getWinner);

gamesRoute.get(routeUri + "/:id/users", controller.getUsersByGameId);

gamesRoute.post(routeUri, controller.createGame);
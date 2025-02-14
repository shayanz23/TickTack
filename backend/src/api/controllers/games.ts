import { Request, Response } from 'express';

import { errorHandler } from '../middlewares/errors.js';
import * as service from "../../database/services/game.js"
import { Game } from '../../models/game.js';
import { verifyId } from '../middlewares/verifyParams.js';
import { User } from '../../models/user.js';

export async function getUsersByGameId(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const users = await service.getUsersByGameId(id) as User[];
		res.json(users);
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}

export async function getGames(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const games = await service.getGames() as Game[];
		res.json(games);
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}

export async function getGame(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const game = await service.getGame(id) as Game;
		res.json(game);
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}

export async function getWinner(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const winner = await service.getWinner(id) as User;
		res.json(winner);
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}

export async function createGame(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const game = await service.createGame(req.body.winnerId, req.body.typeId, 
			req.body.playerIds, req.body.boxPlayerIds);
		res.json(game);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}
import { Request, Response } from 'express';

import { errorHandler } from '../middlewares/errors.js';
import * as gameDbService from "../../database/services/game.js"
import * as userDbService from "../../database/services/user.js"
import * as verificationService from '../middlewares/verification.js';
import { Game } from '../../models/game.js';
import { verifyId } from '../middlewares/verification.js';
import { User } from '../../models/user.js';

export async function getUsersByGameId(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		let players = await gameDbService.getPlayers(id);
		verificationService.verifyAccess(req.cookies.token, undefined, players);
		res.json(players);
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}

export async function getAllGames(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const games = await gameDbService.getGames() as Game[];
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
		const game = (await gameDbService.getGame(id)) as Game;
		let players = await gameDbService.getPlayers(id);
		verificationService.verifyAccess(req.cookies.token, undefined, players);
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
		let players = await gameDbService.getPlayers(id);
		verificationService.verifyAccess(req.cookies.token, undefined, players);
		const winner = await gameDbService.getWinner(id) as User;
		res.json(winner);
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}

export async function createGame(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const game = await gameDbService.createGame(req.body.winnerId, req.body.typeId,
			req.body.playerIds, req.body.boxPlayerIds);
		res.json(game);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}
import { Request, Response } from 'express';
import { genSaltSync, hashSync } from "bcrypt-ts";

import { User } from "../../models/user.js"
import BadRequestError from "../../models/errors/bad-request-error.js";
import { errorHandler } from '../middlewares/errors.js';
import * as service from "../../database/services/user.js"
import { stringToInteger } from '../../services/converters.js';
import { verifyId } from '../middlewares/verifyParams.js';
import { Game } from '../../models/game.js';


export async function createUser(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const salt = genSaltSync(10);
		const hash = hashSync(req.body.password, salt);
		const user = await service.createUser(req.body.email, req.body.username, hash, req.body.role);
		console.log(user.email);
		res.json(user);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function logIn(req: Request, res: Response): Promise<void>  {
    try {
        // Load hash from your password DB.
        const user = await service.logIn(req.body.username, req.body.password) as User;
        res.json(user);
    } catch (error) {
        errorHandler(error as Error, res);
    } 
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const user = await service.deleteUser(id) as User;
		res.json(user);
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}

export async function getGamesByUserId(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const games = await service.getGamesByUserId(id) as Game[];
		res.json(games);
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}

export async function getUserById(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const user = await service.getUser(id) as User;
		res.json(user);
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}

export async function getAllUsers(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const users = await service.getAllUsers() as User[];
		res.json(users);
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}

export async function editUser(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const user = await service.getUser(id) as User;
		res.json(user);
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}

// export async function switche(req: Request, res: Response): Promise<void> {
// 	try {
// 		res.setHeader('Content-Type', 'application/json');
// 		let wires: Boolean[] = [true, true, true]
// 		const noDeath = Math.floor(Math.random()*(3));
// 		wires[noDeath] = false;
// 		const chosen = Math.floor(Math.random()*(3));
// 		const revealed = Math.floor(Math.random()*(3));
// 		res.json({wires, chosen});
// 	} catch (error) {
// 		console.log("error!!!!!!!!!");
// 		errorHandler(error as Error, res);
// 	}
// }

// export async function notswitche(req: Request, res: Response): Promise<void> {
// 	try {
// 		res.setHeader('Content-Type', 'application/json');
		
// 	} catch (error) {
// 		console.log("error!!!!!!!!!");
// 		errorHandler(error as Error, res);
// 	}
// }

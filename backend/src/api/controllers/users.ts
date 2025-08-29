import { Request, Response } from 'express';
import { genSaltSync, hashSync } from "bcrypt-ts";
import jwt from 'jsonwebtoken';

import { User } from "../../models/user.js"
import BadRequestError from "../../models/errors/bad-request-error.js";
import { errorHandler } from '../middlewares/errors.js';
import * as service from "../../database/services/user.js"
import * as verificationService from '../middlewares/verification.js';
import { Game } from '../../models/game.js';
import { PostgresError } from 'postgres';
import { Role } from '../../models/role.js';
import Unauthorized from '../../models/errors/unauthorized-error.js';
import { insurehasValue } from '../middlewares/verification.js';


export async function createUser(req: Request, res: Response): Promise<void> {
	let newUser: User | undefined = undefined;
	const { email, username, password, xp, role } = req.body;
	try {
		res.setHeader('Content-Type', 'application/json');
		if (email === undefined || username === undefined|| password === undefined || xp === undefined || role === undefined) {
			errorHandler((new BadRequestError({ message: "Missing variables." })), res);
			return;
		}
		const salt = genSaltSync(10);
		const hash = hashSync(password, salt);
		newUser = new User(0, email, username, hash, xp, role);
		verificationService.verifyAccess(req.cookies.token, newUser);
		const user = await service.createUser(newUser);
		res.status(200).json(user.toJSON());
		return;
	} catch (error) {
		if ((error as PostgresError).detail?.includes("already exists")) {
			errorHandler((new BadRequestError({ message: "Username or email already in use." })), res);
		}
		if ((error as Unauthorized).statusCode === 401 && newUser !== undefined) {
			if (newUser.role === Role.user) {
				const user = await service.createUser(newUser);
				res.status(200).json(user.toJSON());
				return;
			}
		}
		errorHandler(error as Error, res);
	}
}

export async function logIn(req: Request, res: Response): Promise<void> {
	try {
		insurehasValue([req.body.username, req.body.password]);
		const user = await service.logIn(req.body.username, req.body.password) as User;
		const secret: jwt.Secret = process.env.JWT_SECRET!;
		const token = jwt.sign(user.toJSON(), secret, { expiresIn: "30d" });

		res.cookie("token", token, {
			httpOnly: true,
		})

		res.json(user);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verificationService.verifyId(req.params.id);
		const userToManipulate = await service.getUser(id);
		verificationService.verifyAccess(req.cookies.token, userToManipulate);
		const user = await service.deleteUser(id) as User;
		res.json(user.toJSON());
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}

export async function getGamesByUserId(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verificationService.verifyId(req.params.id);
		const user = await service.getUser(id);
		verificationService.verifyAccess(req.cookies.token, user);
		const games = await service.getGamesByUserId(id) as Game[];
		let jsonGames = Array();
		games.forEach(game => {
			jsonGames.push(game.toJSON());
		});
		res.json(jsonGames);
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}

export async function getUserById(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verificationService.verifyId(req.params.id);
		const user = await service.getUser(id);
		verificationService.verifyAccess(req.cookies.token, user);
		res.json(user.toJSON());
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}

export async function getAllUsers(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const users = await service.getAllUsers() as User[];
		let jsonUsers = Array();
		users.forEach((user: User) => {
			jsonUsers.push(user.toJSON());
		});
		res.json(jsonUsers);
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}

export async function editUser(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verificationService.verifyId(req.params.id);
		const user = await service.getUser(id);
		verificationService.verifyAccess(req.cookies.token, user);
		res.json(user.toJSON());
	} catch (error) {
		console.log("error!!!!!!!!!");
		errorHandler(error as Error, res);
	}
}
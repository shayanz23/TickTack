import express, { NextFunction, Request, Response } from 'express';
import "dotenv/config";
import bodyParser from "body-parser";
import "express-async-errors";
import { genSaltSync, hashSync } from 'bcrypt-ts';
import cookieParser from 'cookie-parser';

import { routes } from './routes/index.js';
import * as dbUsrService from "../database/services/user.js"
import { checkIfEmailIsAvailable, checkIfUsernameIsAvailable } from '../database/services/user.js';
import { Role } from '../models/role.js';
import { User } from '../models/user.js';

const jsonParser = bodyParser.json();

async function createInitAdminUsr() {
    if (process.env.INIT_GOD_PW === undefined || process.env.INIT_GOD_USERNAME === undefined
        || process.env.INIT_GOD_EMAIL === undefined) {
        console.log("Init admin env variables not set!");
        return;
    }

    if (
        (await checkIfUsernameIsAvailable(process.env.INIT_GOD_USERNAME))
        && (await checkIfEmailIsAvailable(process.env.INIT_GOD_EMAIL))) {
        const salt = genSaltSync(10);
        const hash = hashSync(process.env.INIT_GOD_PW, salt);
        const newUser = new User(0, process.env.INIT_GOD_EMAIL, process.env.INIT_GOD_USERNAME, hash, 0, Role.god);
        await dbUsrService.createUser(newUser);

    } else {
        console.log("Init user already exists?");
    }
}

export async function startApi() {
    const app = express();
    createInitAdminUsr();

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", process.env.FRONTEND_DOMAIN);
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Credentials", "true");
        next();
    });

    app.use(cookieParser());
    app.use(jsonParser);
    app.use(express.urlencoded({ extended: true }));
    app.use('/', routes);
    // app.use(errorHandler);

    if (process.env.PORT === undefined) {
        throw new Error("PORT in .env file missing, terminating.");
    }

    app.listen(process.env.PORT, () =>
        console.log(`server running : http://localhost:${process.env.PORT}`),
    );
}
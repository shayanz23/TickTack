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
import { Theme } from '../models/theme.js';

const jsonParser = bodyParser.json();

async function createInitAdminUsr() {
    if (process.env.PRIMARY_ADMIN_PW === undefined || process.env.PRIMARY_ADMIN_USERNAME === undefined
        || process.env.PRIMARY_ADMIN_EMAIL === undefined) {
        console.log("Init admin env variables not set!");
        return;
    }

    if (
        (await checkIfUsernameIsAvailable(process.env.PRIMARY_ADMIN_USERNAME))
        && (await checkIfEmailIsAvailable(process.env.PRIMARY_ADMIN_EMAIL))) {
        const salt = genSaltSync(10);
        const hash = hashSync(process.env.PRIMARY_ADMIN_PW, salt);
        const newUser = new User(0, process.env.PRIMARY_ADMIN_EMAIL, process.env.PRIMARY_ADMIN_USERNAME, hash, 0, true, Theme.system, Role.primary_admin);
        await dbUsrService.createUser(newUser);
        console.log("Primary admin user created.")
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

    // Add this to handle OPTIONS requests
    app.options('*', (req, res) => {
        res.sendStatus(200);
    });

    app.use(cookieParser());
    app.use(jsonParser);
    app.use(express.urlencoded({ extended: true }));
    app.use('/', routes);
    // app.use(errorHandler);

    if (process.env.PORT === undefined) {
        throw new Error("PORT in .env file missing, terminating.");
    }
    if (process.env.API_URI_V1 === undefined) {
        throw new Error("API_URI_V1 in .env file missing, terminating.");
    }
    if (process.env.ADMIN_API_URI_V1 === undefined) {
        throw new Error("ADMIN_API_URI_V1 in .env file missing, terminating.");
    }


    app.listen(process.env.PORT, () =>
        console.log(`server running, API endpoints at: http://localhost:${process.env.PORT}${process.env.API_URI_V1}`),
    );
}
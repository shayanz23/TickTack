

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import BadRequestError from "../../models/errors/bad-request-error.js";
import { errorHandler } from "./errors.js";
import { stringToInteger } from "../../services/converters.js";
import Unauthorized from "../../models/errors/unauthorized-error.js";
import { User } from "../../models/user.js";
import { Role } from "../../models/role.js";

interface MyRequest extends Request {
    user?: any; // Use a specific type here if you have one
}

export function verifyId(id: string | number | undefined): number {
    try {
        if (typeof id === "number") {
            if (id % 1 != 0) {
                throw new BadRequestError({ code: 400, message: "Id must be a whole number!", logging: false });
            }
            return id;
        }
        const newId = stringToInteger(new String(id));
        return newId;
    } catch (error) {
        if (id === undefined || id === "") {
            throw new BadRequestError({ code: 400, message: "Id is blank.", logging: false });
        } else if (isNaN(+id)) {
            console.log(id);
            throw new BadRequestError({ code: 400, message: "Id must be a number!", logging: false });
        } else if (+id % 1 != 0) {
            throw new BadRequestError({ code: 400, message: "Id must be a whole number!", logging: false });
        }
        throw new BadRequestError({ code: 400, message: "Invalid Id.", logging: false });
    }
}

export function insurehasValue(values: any[]) {
    values.forEach(value => {
        if (value === undefined || value === null) {
            throw new BadRequestError({ code: 400, message: "Undefined Values.", logging: false });
        }
    });
}

function UserAccessCheck(jwtUser: User, user: User) {
    if (jwtUser.id === user.id ||
        (jwtUser.role === Role.admin && user.role !== Role.god && user.role !== Role.admin) ||
        (jwtUser.role === Role.god)) {
        return true;
    }
    return false;
}



export function verifyUserAccess(token: any, user?: User, users?: User[]) {
    const secret: jwt.Secret = process.env.JWT_SECRET!;
    const jwtUser: User = jwt.verify(token, secret) as User;
    jwtUser.role = Role[jwtUser.role as unknown as keyof typeof Role];
    let validId = false;
    if (user !== undefined) {
        validId = UserAccessCheck(jwtUser, user);
    }
    if (users !== undefined) {
        users.forEach(user => {
            validId = UserAccessCheck(jwtUser, user);
        });
    }
    if (!validId) {
        throw new Unauthorized({ message: "Cannot modify user(s)" });
    }
}


export async function verifyJwt(req: MyRequest, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    try {
        const secret: jwt.Secret = process.env.JWT_SECRET!;
        const user = jwt.verify(token, secret) as User;
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.clearCookie("token");
        errorHandler(new Unauthorized({ message: "Invalid Token" }), res);
    }
}

export function verifyAdminJwt(req: MyRequest, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    try {
        const secret: jwt.Secret = process.env.JWT_SECRET!;
        let jwtUser = jwt.verify(token, secret) as User;
        jwtUser.role = Role[jwtUser.role as unknown as keyof typeof Role];
        if (jwtUser.role === Role.admin || jwtUser.role === Role.god) {
            req.user = jwtUser;
            next();
        } else {
            errorHandler(new Unauthorized(), res);
        }
    } catch (error) {
        console.log(token)
        res.clearCookie("token");
        errorHandler(new Unauthorized(), res);
    }
}
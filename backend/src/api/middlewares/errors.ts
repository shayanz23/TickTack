import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../models/errors/custom-error.js";

export function errorHandler(err: Error, res: Response) {
    // Handled errors
    if (err instanceof CustomError) {
        console.log("Custom Error!!!!", err.message);
        
        const { statusCode, errors, logging } = err;
        if (logging) {
            console.error(JSON.stringify({
                code: err.statusCode,
                errors: err.errors,
                stack: err.stack,
            }, null, 2));
        }
        return res.status(statusCode).send({statusCode: statusCode, errors: err.errors});
    }
    console.log("Unhandled Error!!!!");
    // Unhandled errors
    console.error(err);
    return res.status(500).send({ errors: [{ message: "Something went wrong." }] });
}
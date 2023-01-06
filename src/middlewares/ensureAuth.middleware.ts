import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../errorGlobal/AppError";

export function ensureAuthMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authToken = request.headers.authorization;
    if (!authToken) {
        throw new AppError(401, "Missing authorization headers");
    }

    const token = authToken.split(" ")[1];

    verify(token, process.env.SECRET_KEY + "", (error, decode) => {
        if (error) {
            throw new AppError(401, "Invalid token");
        }

        request.id = decode?.sub;
    });

    return next();
}

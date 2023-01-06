import { NextFunction, Request, Response } from "express";
import AppDataSource from "../data-source";
import { User } from "../entities/users";
import { AppError } from "../errorGlobal/AppError";

export async function verifyIfUserExistsMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({
        id: request.params.id,
    });

    if (!user) {
        throw new AppError(404, "User not found.");
    }

    return next();
}

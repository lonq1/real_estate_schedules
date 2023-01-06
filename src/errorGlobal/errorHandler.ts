import { NextFunction, Request, Response } from "express";
import { AppError } from "./AppError";

export function errorHandler(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
) {
    if (error instanceof AppError) {
        const { statusCode, message } = error;
        return response.status(statusCode).json({ message });
    }

    console.log(error);

    return response.status(404).json({ message: "Internal server error." });
}

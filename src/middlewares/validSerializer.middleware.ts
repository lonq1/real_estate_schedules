import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";
import { AppError } from "../errorGlobal/AppError";
export const validSerializerMiddleware =
    (schema: AnySchema) =>
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            const validated = await schema.validate(request.body, {
                stripUnknown: true,
                abortEarly: false,
            });

            request.body = validated;

            return next();
        } catch (error) {
            throw new AppError(400, error.errors);
        }
    };

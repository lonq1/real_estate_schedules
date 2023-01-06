import { NextFunction, Request, Response } from "express";
import { AppError } from "../errorGlobal/AppError";

export async function checkIfDateAndHourIsValidMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const { date, hour } = request.body;
    const convertingDate = date.split("/");
    const inputDate = new Date(
        +convertingDate[0],
        +convertingDate[1] - 1,
        +convertingDate[2]
    ).getDay();

    if (inputDate === 0 || inputDate === 6)
        throw new AppError(
            400,
            "You may only schedule a visit in business days."
        );

    const formatedHour = +hour.replace(":", "") / 100;
    if (formatedHour < 8 || formatedHour > 18)
        throw new AppError(
            400,
            "You may only schedule a visit in business hours."
        );

    return next();
}

import { Request, Response } from "express";
import {
    createScheduleService,
    getSchedulesByPropertyIdService,
} from "../services/imports";

async function createScheduleController(request: Request, response: Response) {
    const data = await createScheduleService(request.body, request.id);

    return response.status(201).json(data);
}
async function getSchedulesByPropertyIdController(
    request: Request,
    response: Response
) {
    const data = await getSchedulesByPropertyIdService(request.params.id);
    return response.status(200).json(data);
}
export { createScheduleController, getSchedulesByPropertyIdController };

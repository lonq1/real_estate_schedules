import { Request, Response } from "express";
import { createScheduleService } from "../services/schedules/createSchedule.service";
import { getSchedulesByPropertyIdService } from "../services/schedules/getSchedulesByPropertyId.service";
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

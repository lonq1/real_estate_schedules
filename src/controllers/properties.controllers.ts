import { Request, Response } from "express";
import {
    createPropertyService,
    getAllPropertiesService,
} from "../services/imports";

async function createPropertyController(request: Request, response: Response) {
    const data = await createPropertyService(request.body);
    return response.status(201).json(data);
}

async function getAllPropertiesController(
    request: Request,
    response: Response
) {
    const data = await getAllPropertiesService();
    return response.status(200).json(data);
}

export { createPropertyController, getAllPropertiesController };

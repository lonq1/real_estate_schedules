import { Request, Response } from "express";
import { createPropertyService } from "../services/properties/createProperty.service";
import { getAllPropertiesService } from "../services/properties/getAllProperties.service";

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

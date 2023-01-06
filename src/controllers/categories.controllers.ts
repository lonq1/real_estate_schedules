import { Request, Response } from "express";
import {
    createCategoryService,
    getAllCategoriesService,
    getPropertiesByCategoryIdService,
} from "../services/imports";

async function createCategoryController(request: Request, response: Response) {
    const data = await createCategoryService(request.body);
    return response.status(201).json(data);
}

async function getAllCategoriesController(
    request: Request,
    response: Response
) {
    const data = await getAllCategoriesService();
    return response.status(200).json(data);
}
async function getPropertiesByCategoryIdController(
    request: Request,
    response: Response
) {
    const data = await getPropertiesByCategoryIdService(request.params.id);

    return response.status(200).json(data);
}
export {
    createCategoryController,
    getAllCategoriesController,
    getPropertiesByCategoryIdController,
};

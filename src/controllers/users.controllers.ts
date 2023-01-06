import { Request, Response } from "express";
import {
    createUserService,
    deleteUserService,
    getAllUsersService,
    updateUserService,
} from "../services/imports";

async function createUserController(request: Request, response: Response) {
    const data = await createUserService(request.body);
    return response.status(201).json(data);
}

async function getAllUsersController(request: Request, response: Response) {
    const data = await getAllUsersService();
    return response.json(data);
}

async function deleteUserController(request: Request, response: Response) {
    await deleteUserService(request.params.id);
    return response.status(204).json({});
}

async function updateUserController(request: Request, response: Response) {
    const data = await updateUserService(request.body, request.params.id);
    return response.status(200).json(data);
}

export {
    createUserController,
    getAllUsersController,
    deleteUserController,
    updateUserController,
};

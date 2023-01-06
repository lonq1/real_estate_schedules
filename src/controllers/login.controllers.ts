import { Request, Response } from "express";
import { loginService } from "../services/imports";

export async function loginController(request: Request, response: Response) {
    const token = await loginService(request.body);

    return response.status(200).json({ token });
}

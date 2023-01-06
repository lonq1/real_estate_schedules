import { Router } from "express";
import { loginController } from "../controllers/login.controllers";
import { validSerializerMiddleware } from "../middlewares/imports";
import { loginSerializer } from "../serializers/login.serializer";

export const commonRoutes = Router();

commonRoutes.post(
    "",
    validSerializerMiddleware(loginSerializer),
    loginController
);

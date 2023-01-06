import { Router } from "express";
import {
    createPropertyController,
    getAllPropertiesController,
} from "../controllers/properties.controllers";
import {
    ensureAuthMiddleware,
    validSerializerMiddleware,
    verifyIfAdminMiddleware,
} from "../middlewares/imports";
import { createPropertySerializer } from "../serializers/property.serializer";

export const propertiesRoutes = Router();

propertiesRoutes.post(
    "",
    ensureAuthMiddleware,
    verifyIfAdminMiddleware,
    validSerializerMiddleware(createPropertySerializer),
    createPropertyController
);

propertiesRoutes.get("", getAllPropertiesController);

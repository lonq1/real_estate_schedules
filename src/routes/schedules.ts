import { Router } from "express";
import {
    createScheduleController,
    getSchedulesByPropertyIdController,
} from "../controllers/imports";
import {
    checkIfDateAndHourIsValidMiddleware,
    ensureAuthMiddleware,
    validSerializerMiddleware,
    verifyIfAdminMiddleware,
    verifyIfUserExistsMiddleware,
} from "../middlewares/imports";
import { createScheduleSerializer } from "../serializers/schedules.serializer";

export const schedulesRoutes = Router();

schedulesRoutes.post(
    "",
    ensureAuthMiddleware,
    verifyIfUserExistsMiddleware,
    checkIfDateAndHourIsValidMiddleware,
    validSerializerMiddleware(createScheduleSerializer),
    createScheduleController
);
schedulesRoutes.get(
    "/properties/:id",
    ensureAuthMiddleware,
    verifyIfAdminMiddleware,
    getSchedulesByPropertyIdController
);

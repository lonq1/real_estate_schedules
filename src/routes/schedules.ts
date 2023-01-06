import { Router } from "express";
import {
    createScheduleController,
    getSchedulesByPropertyIdController,
} from "../controllers/imports";
import {
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
    validSerializerMiddleware(createScheduleSerializer),
    verifyIfUserExistsMiddleware,

    createScheduleController
);
schedulesRoutes.get(
    "/properties/:id",
    ensureAuthMiddleware,
    verifyIfAdminMiddleware,
    getSchedulesByPropertyIdController
);

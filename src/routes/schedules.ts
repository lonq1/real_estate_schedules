import { Router } from "express";
import {
    createScheduleController,
    getSchedulesByPropertyIdController,
} from "../controllers/schedules.controllers";
import { ensureAuthMiddleware } from "../middlewares/ensureAuth.middleware";
import { verifyIfAdminMiddleware } from "../middlewares/verifyIfAdmin.middleware";

export const schedulesRoutes = Router();

schedulesRoutes.post("", ensureAuthMiddleware, createScheduleController);
schedulesRoutes.get(
    "/properties/:id",
    ensureAuthMiddleware,
    verifyIfAdminMiddleware,
    getSchedulesByPropertyIdController
);

import { Router } from "express";
import {
    getAllCategoriesController,
    getPropertiesByCategoryIdController,
} from "../controllers/categories.controllers";
import { createCategoryController } from "../controllers/imports";
import {
    ensureAuthMiddleware,
    validSerializerMiddleware,
    verifyIfAdminMiddleware,
} from "../middlewares/imports";
import { createCategorySerializer } from "../serializers/category.serializer";

export const categoriesRoutes = Router();

categoriesRoutes.post(
    "",
    ensureAuthMiddleware,
    verifyIfAdminMiddleware,
    validSerializerMiddleware(createCategorySerializer),
    createCategoryController
);

categoriesRoutes.get("", getAllCategoriesController);

categoriesRoutes.get("/:id/properties", getPropertiesByCategoryIdController);

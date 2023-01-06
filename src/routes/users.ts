import { Router } from "express";
import {
    createUserController,
    getAllUsersController,
    updateUserController,
    deleteUserController,
} from "../controllers/imports";
import {
    validSerializerMiddleware,
    verifyIfAdminMiddleware,
    verifyIfUserExistsMiddleware,
    ensureAuthMiddleware,
} from "../middlewares/imports";
import {
    createUserSerializer,
    updateUserSerializer,
} from "../serializers/user.serializer";

export const usersRoutes = Router();

usersRoutes.post(
    "",
    validSerializerMiddleware(createUserSerializer),
    createUserController
);
usersRoutes.get(
    "",
    ensureAuthMiddleware,
    verifyIfAdminMiddleware,
    getAllUsersController
);
usersRoutes.delete(
    "/:id",
    ensureAuthMiddleware,
    verifyIfAdminMiddleware,
    verifyIfUserExistsMiddleware,
    deleteUserController
);
usersRoutes.patch(
    "/:id",
    ensureAuthMiddleware,
    verifyIfAdminMiddleware,
    verifyIfUserExistsMiddleware,
    validSerializerMiddleware(updateUserSerializer),
    updateUserController
);

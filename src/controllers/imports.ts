import {
    createCategoryController,
    getAllCategoriesController,
    getPropertiesByCategoryIdController,
} from "./categories.controllers";
import { loginController } from "./login.controllers";
import {
    createUserController,
    getAllUsersController,
    deleteUserController,
    updateUserController,
} from "./users.controllers";
import {
    createPropertyController,
    getAllPropertiesController,
} from "./properties.controllers";
import {
    createScheduleController,
    getSchedulesByPropertyIdController,
} from "./schedules.controllers";

export {
    loginController,
    createCategoryController,
    createUserController,
    getAllUsersController,
    deleteUserController,
    updateUserController,
    createPropertyController,
    createScheduleController,
    getAllCategoriesController,
    getAllPropertiesController,
    getPropertiesByCategoryIdController,
    getSchedulesByPropertyIdController,
};

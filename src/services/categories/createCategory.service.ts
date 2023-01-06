import AppDataSource from "../../data-source";
import { Categories } from "../../entities/imports";
import { AppError } from "../../errorGlobal/AppError";
import {
    ICategoryRequest,
    ICategoryResponse,
} from "../../interfaces/categories";

export async function createCategoryService(
    payload: ICategoryRequest
): Promise<ICategoryResponse> {
    const categoryRepo = AppDataSource.getRepository(Categories);

    const data = await categoryRepo.findOneBy({
        name: payload.name,
    });

    if (data) {
        throw new AppError(409, "Category already exist's in our database.");
    }

    const newCategory = categoryRepo.create(payload);
    await categoryRepo.save(newCategory);

    return newCategory;
}

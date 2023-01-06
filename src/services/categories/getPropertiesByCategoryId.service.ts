import AppDataSource from "../../data-source";
import { Categories } from "../../entities/imports";
import { AppError } from "../../errorGlobal/AppError";
import { ICategoryResponse } from "../../interfaces/categories";

export async function getPropertiesByCategoryIdService(
    id: string
): Promise<ICategoryResponse> {
    const categoriesRepo = AppDataSource.getRepository(Categories);

    const validId = await categoriesRepo.findOneBy({ id });
    if (!validId) throw new AppError(404, "Category doesn't exists.");

    const category = await categoriesRepo
        .createQueryBuilder("categories")
        .leftJoinAndSelect("categories.properties", "properties")
        .where("categories.id = :categories_id", { categories_id: id })
        .getOne();

    return category;
}

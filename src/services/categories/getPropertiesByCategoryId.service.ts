import AppDataSource from "../../data-source";
import { Categories } from "../../entities/categories";
import { AppError } from "../../errorGlobal/AppError";

export async function getPropertiesByCategoryIdService(id: string) {
    const categoriesRepo = AppDataSource.getRepository(Categories);

    const validId = await categoriesRepo.findOneBy({ id });
    if (!validId) throw new AppError(404, "Category doesn't exists.");

    const property = await categoriesRepo
        .createQueryBuilder("categories")
        .leftJoinAndSelect("categories.properties", "properties")
        .where("categories.id = :categories_id", { categories_id: id })
        .getOne();

    return property;
}

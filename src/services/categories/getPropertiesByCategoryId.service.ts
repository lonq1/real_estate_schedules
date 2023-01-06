import AppDataSource from "../../data-source";
import { Categories } from "../../entities/categories";
import { Properties } from "../../entities/properties";
import { AppError } from "../../errorGlobal/AppError";

export async function getPropertiesByCategoryIdService(id: string) {
    const categoriesRepo = AppDataSource.getRepository(Categories);

    const validId = await categoriesRepo.findOneBy({ id });
    if (!validId) throw new AppError(404, "Category doesn't exists.");

    const properties = await categoriesRepo
        .createQueryBuilder("categories")
        .innerJoinAndSelect("categories.property", "property")
        .where("categories.id = :categories_id", { categories_id: id })
        .getMany();

    console.log(properties);

    return properties;
}

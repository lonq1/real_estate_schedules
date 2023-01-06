import AppDataSource from "../../data-source";
import { Categories } from "../../entities/categories";

export async function getAllCategoriesService() {
    const categoryRepo = AppDataSource.getRepository(Categories);
    return await categoryRepo.find();
}

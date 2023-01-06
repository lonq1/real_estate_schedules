import AppDataSource from "../../data-source";
import { Categories } from "../../entities/imports";
import { ICategoryResponse } from "../../interfaces/categories";

export async function getAllCategoriesService(): Promise<ICategoryResponse[]> {
    const categoryRepo = AppDataSource.getRepository(Categories);
    return await categoryRepo.find();
}

import AppDataSource from "../../data-source";
import { Properties } from "../../entities/imports";
import { IPropertyResponse } from "../../interfaces/properties";

export async function getAllPropertiesService(): Promise<IPropertyResponse[]> {
    const propertyRepo = AppDataSource.getRepository(Properties);
    return await propertyRepo.find({
        relations: {
            address: true,
            category: true,
        },
    });
}

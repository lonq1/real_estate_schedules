import AppDataSource from "../../data-source";
import { Properties } from "../../entities/properties";

export async function getAllPropertiesService() {
    const propertyRepo = AppDataSource.getRepository(Properties);
    return await propertyRepo.find({
        relations: {
            address: true,
        },
    });
}

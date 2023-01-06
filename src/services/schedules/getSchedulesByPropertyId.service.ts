import AppDataSource from "../../data-source";
import { Properties } from "../../entities/properties";
import { Schedules } from "../../entities/schedules_user_properties";
import { AppError } from "../../errorGlobal/AppError";

export async function getSchedulesByPropertyIdService(id: string) {
    const propertiesRepo = AppDataSource.getRepository(Properties);
    const validId = await propertiesRepo.findOneBy({ id });
    if (!validId) throw new AppError(404, "Property not found.");

    const schedulesRepo = AppDataSource.getRepository(Schedules);
    const schedules = await schedulesRepo
        .createQueryBuilder("schedules_user_properties")
        .innerJoinAndSelect("schedules_user_properties.property", "property")
        .innerJoinAndSelect("property.category", "category")
        .innerJoinAndSelect("property.address", "address")
        .where("schedules_user_properties.propertyId = :property_id", {
            property_id: id,
        })
        .getMany();

    return schedules;
}

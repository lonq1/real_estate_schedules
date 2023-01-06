import AppDataSource from "../../data-source";
import { Properties } from "../../entities/properties";
import { AppError } from "../../errorGlobal/AppError";

export async function getSchedulesByPropertyIdService(id: string) {
    const propertiesRepo = AppDataSource.getRepository(Properties);
    const propertyExists = await propertiesRepo.findOneBy({ id });
    if (!propertyExists) throw new AppError(404, "Property not found.");

    const schedules = await propertiesRepo
        .createQueryBuilder("properties")
        .innerJoinAndSelect("properties.schedules", "schedules")
        .innerJoinAndSelect("schedules.user", "user")
        .innerJoinAndSelect("properties.address", "address")
        .where("properties.id = :properties_id", { properties_id: id })
        .getOne();

    return schedules;
}

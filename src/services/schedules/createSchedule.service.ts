import AppDataSource from "../../data-source";
import { Properties, Schedules, User } from "../../entities/imports";
import { AppError } from "../../errorGlobal/AppError";
import { IScheduleRequest } from "../../interfaces/schedules";

export async function createScheduleService(
    payload: IScheduleRequest,
    userId: string
): Promise<object> {
    const { propertyId, date, hour } = payload;

    const propertiesRepo = AppDataSource.getRepository(Properties);
    const propertyExists = await propertiesRepo.findOneBy({ id: propertyId });
    if (!propertyExists) throw new AppError(404, "Property not found");

    const userRepo = AppDataSource.getRepository(User);
    const userExists = await userRepo.findOneBy({ id: userId });

    const checkPropertyAvailability = await propertiesRepo
        .createQueryBuilder("properties")
        .innerJoinAndSelect(
            "properties.schedules",
            "schedule",
            "schedule.date = :date",
            {
                date,
            }
        )
        .where("properties.id = :properties_id", { properties_id: propertyId })
        .andWhere("schedule.hour = :hour", {
            hour,
        })
        .getOne();

    if (checkPropertyAvailability)
        throw new AppError(409, "Property schedule already exists");

    const checkUserAvailability = await userRepo
        .createQueryBuilder("user")
        .innerJoinAndSelect(
            "user.schedules",
            "schedule",
            "schedule.date = :date",
            {
                date,
            }
        )
        .where("user.id = :user_id", { user_id: userId })
        .andWhere("schedule.hour = :hour", {
            hour,
        })
        .getOne();

    if (checkUserAvailability)
        throw new AppError(409, "User schedule already exists");

    const schedulesRepo = AppDataSource.getRepository(Schedules);

    await schedulesRepo.save({
        date,
        hour,
        properties: propertyExists,
        user: userExists,
    });

    return { message: "Schedule created" };
}

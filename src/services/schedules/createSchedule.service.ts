import AppDataSource from "../../data-source";
import { Properties } from "../../entities/properties";
import { Schedules } from "../../entities/schedules_user_properties";
import { User } from "../../entities/users";
import { AppError } from "../../errorGlobal/AppError";
import { IScheduleRequest } from "../../interfaces/schedules";

export async function createScheduleService(
    payload: IScheduleRequest,
    userId: string
) {
    const { propertyId, date, hour } = payload;
    const convertingDate = date.split("/");
    const inputDate = new Date(
        +convertingDate[0],
        +convertingDate[1] - 1,
        +convertingDate[2]
    ).getDay();

    if (inputDate === 0 || inputDate === 6)
        throw new AppError(400, "Invalid date.");

    const formatedHour = +hour.replace(":", "") / 100;
    if (formatedHour < 8 || formatedHour > 18)
        throw new AppError(400, "Invalid hour");

    const schedulesRepo = AppDataSource.getRepository(Schedules);
    const propertiesRepo = AppDataSource.getRepository(Properties);
    const userRepo = AppDataSource.getRepository(User);

    const propertyExists = await propertiesRepo.findOneBy({ id: propertyId });
    if (!propertyExists) throw new AppError(404, "Property not found");

    const userExists = await userRepo.findOneBy({ id: userId });
    if (!userExists) throw new AppError(404, "User not found");

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

    await schedulesRepo.save({
        date,
        hour,
        properties: propertyExists,
        user: userExists,
    });

    return { message: "Schedule created" };
}

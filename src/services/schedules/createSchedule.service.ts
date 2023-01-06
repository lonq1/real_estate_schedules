import AppDataSource from "../../data-source";
import { Properties } from "../../entities/properties";
import { Schedules } from "../../entities/schedules_user_properties";
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

    const validId = await propertiesRepo.findOneBy({ id: propertyId });
    if (!validId) throw new AppError(404, "Property not found");

    const checkIfPropertyIsAvailable = await schedulesRepo
        .createQueryBuilder("schedules_user_properties")
        .innerJoinAndSelect("schedules_user_properties.property", "property")
        .innerJoinAndSelect("schedules_user_properties.user", "user")
        .where("schedules_user_properties.userId = :user_id", {
            user_id: userId,
        })
        .getMany();

    const newSchedule = schedulesRepo.create({ date, hour });

    await schedulesRepo.save({ ...newSchedule, userId, propertyId });
    return { message: "Schedule created" };
}

import AppDataSource from "../../data-source";
import { User } from "../../entities/users";
import { AppError } from "../../errorGlobal/AppError";

export async function deleteUserService(id: string): Promise<void> {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id });
    if (!user.isActive) throw new AppError(400, "User is inactive already.");

    await userRepo.softDelete({ id });
    user.isActive = false;
    await userRepo.save(user);
}

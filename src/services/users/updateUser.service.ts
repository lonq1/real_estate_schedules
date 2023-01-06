import { hashSync } from "bcryptjs";
import AppDataSource from "../../data-source";
import { User } from "../../entities/users";
import { AppError } from "../../errorGlobal/AppError";
import { IUserUpdate, IUserUpdateResponse } from "../../interfaces/users";

export async function updateUserService(
    payload: IUserUpdate,
    id: string
): Promise<IUserUpdateResponse> {
    const { email } = payload;

    const userRepo = AppDataSource.getRepository(User);
    const checkEmail = await userRepo.findOneBy({ email });

    if (checkEmail) throw new AppError(401, "Can't update to this email.");

    const user = await userRepo.findOneBy({ id });

    const updatedUser = {
        ...user,
        ...payload,
    };

    if (payload.password) updatedUser.password = hashSync(payload.password, 10);

    const { password, ...userWithoutPassword } = updatedUser;

    await userRepo.save(updatedUser);
    return userWithoutPassword;
}

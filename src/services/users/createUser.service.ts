import AppDataSource from "../../data-source";
import { User } from "../../entities/users";
import { AppError } from "../../errorGlobal/AppError";
import { IUserRequest, IUserResponse } from "../../interfaces/users";

export async function createUserService(
    payload: IUserRequest
): Promise<IUserResponse> {
    const userRepo = AppDataSource.getRepository(User);

    const data = await userRepo.findOneBy({
        email: payload.email,
    });

    if (data) throw new AppError(409, "User already exist's in our database.");

    const newUser = userRepo.create(payload);
    await userRepo.save(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}

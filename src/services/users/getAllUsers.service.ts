import AppDataSource from "../../data-source";
import { User } from "../../entities/users";
import { IUserResponse } from "../../interfaces/users";

export async function getAllUsersService(): Promise<IUserResponse[]> {
    const userRepo = AppDataSource.getRepository(User);
    const allUsers = await userRepo.find();
    return allUsers.map(({ password, ...user }) => user);
}

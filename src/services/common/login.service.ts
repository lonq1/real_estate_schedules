import { compareSync } from "bcryptjs";
import AppDataSource from "../../data-source";
import { User } from "../../entities/imports";
import { IUserLogin } from "../../interfaces/users";
import jwt from "jsonwebtoken";
import { AppError } from "../../errorGlobal/AppError";

export async function loginService({
    email,
    password,
}: IUserLogin): Promise<string> {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({
        email,
    });

    if (!user) throw new AppError(403, "Invalid e-mail or password");

    const verifyPassword = compareSync(password, user.password);
    if (!verifyPassword) throw new AppError(403, "Invalid e-mail or password");

    if (!user.isActive) throw new AppError(400, "User is inactive");

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY + "", {
        expiresIn: "24h",
        subject: user.id,
    });

    return token;
}

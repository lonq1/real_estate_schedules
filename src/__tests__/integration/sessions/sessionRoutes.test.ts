import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import {
    mockedAdmin,
    mockedAdminLogin,
    mockedUser,
    mockedUserLogin,
} from "../../mocks";
import { User } from "../../../entities/users";

describe("/login", () => {
    let connection: DataSource;
    const usersRepository = AppDataSource.getRepository(User);

    beforeAll(async () => {
        await AppDataSource.initialize()
            .then((res) => {
                connection = res;
            })
            .catch((err) => {
                console.error("Error during Data Source initialization", err);
            });

        const admin = usersRepository.create(mockedAdmin);
        await usersRepository.save(admin);
    });

    afterAll(async () => {
        await connection.destroy();
    });

    it("POST /login - Should be able to login with the user", async () => {
        const response = await request(app)
            .post("/login")
            .send(mockedAdminLogin);

        expect(response.body).toHaveProperty("token");
        expect(response.status).toBe(200);
    });

    it("POST /login - Should NOT be able to login with the user with incorrect password or email", async () => {
        const response = await request(app).post("/login").send({
            email: "felipe@mail.com",
            password: "1234567",
        });

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(403);
    });

    it("POST /login - Should NOT be able to login with the user with isActive = false", async () => {
        const user = usersRepository.create({ ...mockedUser, isActive: false });
        await usersRepository.save(user);

        const response = await request(app)
            .post("/login")
            .send(mockedUserLogin);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(400);
    });
});

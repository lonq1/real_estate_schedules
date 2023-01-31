import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import {
    mockedUser,
    mockedAdmin,
    mockedAdminLogin,
    mockedUserLogin,
    mockedCategory,
    mockedInvalidId,
} from "../../mocks";
import { User } from "../../../entities/users";
import { Categories } from "../../../entities/categories";

describe("/categories", () => {
    let connection: DataSource;
    const usersRepository = AppDataSource.getRepository(User);
    const categoriesRepository = AppDataSource.getRepository(Categories);

    beforeAll(async () => {
        await AppDataSource.initialize()
            .then((res) => {
                connection = res;
            })
            .catch((err) => {
                console.error("Error during Data Source initialization", err);
            });

        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const admin = usersRepository.create(mockedAdmin);
        await usersRepository.save(admin);
    });

    beforeEach(async () => {
        await categoriesRepository.clear();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    it("POST /categories - Should be able to create category", async () => {
        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const response = await request(app)
            .post("/categories")
            .set("Authorization", adminToken)
            .send(mockedCategory);

        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("id");
        expect(response.status).toBe(201);
    });

    it("POST /categories - Should NOT be able to create category that already exists", async () => {
        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const response = await request(app)
            .post("/categories")
            .set("Authorization", adminToken)
            .send(mockedCategory);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(409);
    });

    it("POST /categories - Should NOT be able to create category without authentication", async () => {
        const response = await request(app)
            .post("/categories")
            .send(mockedCategory);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(401);
    });

    it("POST /categories - Should NOT be able to create category not being admin", async () => {
        const userLoginResponse = await request(app)
            .post("/login")
            .send(mockedUserLogin);
        const userToken = `Bearer ${userLoginResponse.body.token}`;

        const response = await request(app)
            .post("/categories")
            .set("Authorization", userToken)
            .send(mockedCategory);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(403);
    });

    it("GET /categories - Should be able to list all categories", async () => {
        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const response = await request(app).get("/categories");

        expect(response.body).toHaveLength(1);
        expect(response.body[0].name).toBe(mockedCategory.name);
        expect(response.status).toBe(200);
    });

    it("GET /categories/:id/properties - Should be able to list one category properties", async () => {
        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const response = await request(app).get(
            `/categories/${category.id}/properties`
        );

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("properties");
    });

    it("GET /categories/:id/properties - Should NOT be able to list properties of a category with invalid id", async () => {
        const response = await request(app).get(
            `/categories/${mockedInvalidId}/properties`
        );

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(404);
    });
});

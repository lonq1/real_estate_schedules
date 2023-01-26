import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import {
    mockedUser,
    mockedAdmin,
    mockedAdminLogin,
    mockedCategory,
    mockedProperty,
    mockedPropertyInvalidCategoryId,
    mockedPropertyInvalidState,
    mockedPropertyInvalidZipCode,
    mockedUserLogin,
} from "../../mocks";
import { Categories } from "../../../entities/categories";
import { User } from "../../../entities/users";
import { Properties } from "../../../entities/properties";
import { Addresses } from "../../../entities/addresses";

describe("/properties", () => {
    let connection: DataSource;
    const usersRepository = AppDataSource.getRepository(User);
    const categoriesRepository = AppDataSource.getRepository(Categories);
    const propertiesRepository = AppDataSource.getRepository(Properties);
    const addressesRepository = AppDataSource.getRepository(Addresses);

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
        await propertiesRepository.clear();
        await addressesRepository.clear();
        await categoriesRepository.clear();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    it("POST /properties - Should be able to create a property", async () => {
        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const response = await request(app)
            .post("/properties")
            .set("Authorization", adminToken)
            .send({ ...mockedProperty, categoryId: category.id });

        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("value");
        expect(response.body).toHaveProperty("createdAt");
        expect(response.body).toHaveProperty("updatedAt");
        expect(response.body).toHaveProperty("address");
        expect(response.body.address).toHaveProperty("id");
        expect(response.body.address).toHaveProperty("zipCode");
        expect(response.status).toBe(201);
    });

    it("POST /properties - Should NOT be able to create a property that already exists", async () => {
        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const address = addressesRepository.create(mockedProperty.address);
        await addressesRepository.save(address);

        const property = propertiesRepository.create({
            ...mockedProperty,
            category,
            address,
        });
        await propertiesRepository.save(property);

        const response = await request(app)
            .post("/properties")
            .set("Authorization", adminToken)
            .send({ ...mockedProperty, categoryId: category.id });

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(409);
    });

    it("POST /properties - Should NOT be able to create a property without being an admin", async () => {
        const userLoginResponse = await request(app)
            .post("/login")
            .send(mockedUserLogin);
        const userToken = `Bearer ${userLoginResponse.body.token}`;

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const response = await request(app)
            .post("/properties")
            .set("Authorization", userToken)
            .send({ ...mockedProperty, categoryId: category.id });

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(403);
    });

    it("POST /properties - Should NOT be able to create a property without authentication", async () => {
        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const response = await request(app)
            .post("/properties")
            .send({ ...mockedProperty, categoryId: category.id });

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(401);
    });

    it("POST /properties - Should NOT be able to create property with invalid category id", async () => {
        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const response = await request(app)
            .post("/properties")
            .set("Authorization", adminToken)
            .send(mockedPropertyInvalidCategoryId);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(404);
    });

    it("POST /properties - Should NOT be able to create a property with invalid zipCode", async () => {
        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const response = await request(app)
            .post("/properties")
            .set("Authorization", adminToken)
            .send({ ...mockedPropertyInvalidZipCode, categoryId: category.id });

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(400);
    });

    it("POST /properties - Should NOT be able to create a property with invalid state", async () => {
        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const response = await request(app)
            .post("/properties")
            .set("Authorization", adminToken)
            .send(mockedPropertyInvalidState);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(400);
    });

    it("GET /properties - Should be able to list all properties", async () => {
        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const address = addressesRepository.create(mockedProperty.address);
        await addressesRepository.save(address);

        const property = propertiesRepository.create({
            ...mockedProperty,
            category,
            address,
        });
        await propertiesRepository.save(property);

        const response = await request(app).get("/properties");

        expect(response.body[0].category.id).toBe(category.id);
        expect(response.body[0].address.zipCode).toBe(property.address.zipCode);
        expect(response.body).toHaveLength(1);
        expect(response.status).toBe(200);
    });
});

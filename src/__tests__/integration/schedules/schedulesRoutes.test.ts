import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import {
    mockedUser,
    mockedAdmin,
    mockedAdminLogin,
    mockedUserLogin,
    mockedSchedule,
    mockedScheduleInvalidPropertyId,
    mockedScheduleInvalidDate,
    mockedScheduleInvalidHourLess8,
    mockedScheduleInvalidHourMore18,
    mockedProperty2,
    mockedProperty,
    mockedCategory,
    mockedInvalidId,
} from "../../mocks";
import { User } from "../../../entities/users";
import { Properties } from "../../../entities/properties";
import { Categories } from "../../../entities/categories";
import { Addresses } from "../../../entities/addresses";
import { Schedules } from "../../../entities/schedules_user_properties";

describe("/schedules", () => {
    let connection: DataSource;
    const usersRepository = AppDataSource.getRepository(User);
    const addressesRepository = AppDataSource.getRepository(Addresses);
    const propertiesRepository = AppDataSource.getRepository(Properties);
    const categoriesRepository = AppDataSource.getRepository(Categories);
    const schedulesRepository = AppDataSource.getRepository(Schedules);

    beforeAll(async () => {
        await AppDataSource.initialize()
            .then((res) => {
                connection = res;
            })
            .catch((err) => {
                console.error("Error during Data Source initialization", err);
            });
    });

    beforeEach(async () => {
        await schedulesRepository.clear();
        await propertiesRepository.clear();
        await usersRepository.clear();
        await addressesRepository.clear();
        await categoriesRepository.clear();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    it("POST /schedules - Should be able to create a schedule", async () => {
        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const userLoginResponse = await request(app)
            .post("/login")
            .send(mockedUserLogin);
        const userToken = `Bearer ${userLoginResponse.body.token}`;

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const address = addressesRepository.create({
            ...mockedProperty.address,
        });
        await addressesRepository.save(address);

        const property = propertiesRepository.create({
            ...mockedProperty,
            address,
            category,
        });
        await propertiesRepository.save(property);

        const response = await request(app)
            .post("/schedules")
            .set("Authorization", userToken)
            .send({
                ...mockedSchedule,
                userId: user.id,
                propertyId: property.id,
            });

        const scheduleInDatabase = await schedulesRepository.find();

        expect(response.body).toHaveProperty("message");
        expect(scheduleInDatabase.length).toBe(1);
        expect(response.status).toBe(201);
    });

    it("POST /schedules - Should NOT be able to create a schedule that already exists on a property", async () => {
        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const userLoginResponse = await request(app)
            .post("/login")
            .send(mockedUserLogin);
        const userToken = `Bearer ${userLoginResponse.body.token}`;

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const address = addressesRepository.create({
            ...mockedProperty.address,
        });
        await addressesRepository.save(address);

        const property = propertiesRepository.create({
            ...mockedProperty,
            address,
            category,
        });
        await propertiesRepository.save(property);

        const schedule = schedulesRepository.create({
            ...mockedSchedule,
            user,
            properties: property,
        });
        await schedulesRepository.save(schedule);

        const response = await request(app)
            .post("/schedules")
            .set("Authorization", userToken)
            .send({
                ...mockedSchedule,
                userId: user.id,
                propertyId: property.id,
            });

        const scheduleInDatabase = await schedulesRepository.find();

        expect(response.body).toHaveProperty("message");
        expect(scheduleInDatabase.length).toBe(1);
        expect(response.status).toBe(409);
    });

    it("POST /schedules - Should NOT be able to make 2 schedules in different properties with the same date and time", async () => {
        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const userLoginResponse = await request(app)
            .post("/login")
            .send(mockedUserLogin);
        const userToken = `Bearer ${userLoginResponse.body.token}`;

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const address = addressesRepository.create({
            ...mockedProperty.address,
        });
        await addressesRepository.save(address);

        const property = propertiesRepository.create({
            ...mockedProperty,
            address,
            category,
        });
        await propertiesRepository.save(property);

        const anotherAddress = addressesRepository.create({
            ...mockedProperty2.address,
        });
        await addressesRepository.save(anotherAddress);

        const anotherProperty = propertiesRepository.create({
            ...mockedProperty2,
            address: anotherAddress,
            category,
        });
        await propertiesRepository.save(anotherProperty);

        const schedule = schedulesRepository.create({
            ...mockedSchedule,
            user,
            properties: anotherProperty,
        });
        await schedulesRepository.save(schedule);

        const response = await request(app)
            .post("/schedules")
            .set("Authorization", userToken)
            .send({
                ...mockedSchedule,
                userId: user.id,
                propertyId: property.id,
            });

        const scheduleInDatabase = await schedulesRepository.find();

        expect(scheduleInDatabase).toHaveLength(1);
        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(409);
    });

    it("POST /schedules - Should NOT be able to create a schedule with an invalid date", async () => {
        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const userLoginResponse = await request(app)
            .post("/login")
            .send(mockedUserLogin);
        const userToken = `Bearer ${userLoginResponse.body.token}`;

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const address = addressesRepository.create({
            ...mockedProperty.address,
        });
        await addressesRepository.save(address);

        const property = propertiesRepository.create({
            ...mockedProperty,
            address,
            category,
        });
        await propertiesRepository.save(property);

        const response = await request(app)
            .post("/schedules")
            .set("Authorization", userToken)
            .send({
                ...mockedScheduleInvalidDate,
                userId: user.id,
                propertyId: property.id,
            });

        const scheduleInDatabase = await schedulesRepository.find();

        expect(scheduleInDatabase).toHaveLength(0);
        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(400);
    });

    it("POST /schedules - Should NOT be able to create a schedule with an invalid hour < 8", async () => {
        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const userLoginResponse = await request(app)
            .post("/login")
            .send(mockedUserLogin);
        const userToken = `Bearer ${userLoginResponse.body.token}`;

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const address = addressesRepository.create({
            ...mockedProperty.address,
        });
        await addressesRepository.save(address);

        const property = propertiesRepository.create({
            ...mockedProperty,
            address,
            category,
        });
        await propertiesRepository.save(property);

        const response = await request(app)
            .post("/schedules")
            .set("Authorization", userToken)
            .send({
                ...mockedScheduleInvalidHourLess8,
                userId: user.id,
                propertyId: property.id,
            });

        const scheduleInDatabase = await schedulesRepository.find();

        expect(scheduleInDatabase).toHaveLength(0);
        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(400);
    });

    it("POST /schedules - Should NOT be able to create a schedule with an invalid hour > 18", async () => {
        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const userLoginResponse = await request(app)
            .post("/login")
            .send(mockedUserLogin);
        const userToken = `Bearer ${userLoginResponse.body.token}`;

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const address = addressesRepository.create({
            ...mockedProperty.address,
        });
        await addressesRepository.save(address);

        const property = propertiesRepository.create({
            ...mockedProperty,
            address,
            category,
        });
        await propertiesRepository.save(property);

        const response = await request(app)
            .post("/schedules")
            .set("Authorization", userToken)
            .send({
                ...mockedScheduleInvalidHourMore18,
                userId: user.id,
                propertyId: property.id,
            });

        const scheduleInDatabase = await schedulesRepository.find();

        expect(scheduleInDatabase).toHaveLength(0);
        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(400);
    });

    it("POST /schedules - Should NOT be able to create a schedule with an invalid property id", async () => {
        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const userLoginResponse = await request(app)
            .post("/login")
            .send(mockedUserLogin);
        const userToken = `Bearer ${userLoginResponse.body.token}`;

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const response = await request(app)
            .post("/schedules")
            .set("Authorization", userToken)
            .send({
                ...mockedSchedule,
                userId: user.id,
                propertyId: mockedInvalidId,
            });

        const scheduleInDatabase = await schedulesRepository.find();

        expect(scheduleInDatabase).toHaveLength(0);
        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(404);
    });

    it("POST /schedules - Should NOT be able to create a schedule without authentication", async () => {
        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const address = addressesRepository.create({
            ...mockedProperty.address,
        });
        await addressesRepository.save(address);

        const property = propertiesRepository.create({
            ...mockedProperty,
            address,
            category,
        });
        await propertiesRepository.save(property);

        const response = await request(app)
            .post("/schedules")
            .send({
                ...mockedSchedule,
                userId: user.id,
                propertyId: property.id,
            });

        const scheduleInDatabase = await schedulesRepository.find();

        expect(scheduleInDatabase).toHaveLength(0);
        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(401);
    });

    it("GET /schedules/properties/:id - Should be able to list the schedules of a property", async () => {
        const admin = usersRepository.create(mockedAdmin);
        await usersRepository.save(admin);

        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const address = addressesRepository.create({
            ...mockedProperty.address,
        });
        await addressesRepository.save(address);

        const property = propertiesRepository.create({
            ...mockedProperty,
            address,
            category,
        });
        await propertiesRepository.save(property);

        const schedule = schedulesRepository.create({
            ...mockedSchedule,
            user: admin,
            properties: property,
        });
        await schedulesRepository.save(schedule);

        const response = await request(app)
            .get(`/schedules/properties/${property.id}`)
            .set("Authorization", adminToken);

        const scheduleInDatabase = await schedulesRepository.find();

        expect(scheduleInDatabase[0]).toHaveProperty("id");
        expect(scheduleInDatabase[0]).toHaveProperty("date");
        expect(scheduleInDatabase[0]).toHaveProperty("hour");
        expect(scheduleInDatabase).toHaveLength(1);

        expect(response.body).toHaveProperty("schedules");
        expect(response.body.schedules[0]).toHaveProperty("id");
        expect(response.body.schedules[0]).toHaveProperty("user");
        expect(response.body.schedules).toHaveLength(1);
        expect(response.status).toBe(200);
    });

    it("GET /schedules/properties/:id - Should NOT be able to list the schedules of a property with invalid id", async () => {
        const admin = usersRepository.create(mockedAdmin);
        await usersRepository.save(admin);

        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const response = await request(app)
            .get(`/schedules/properties/${mockedInvalidId}`)
            .set("Authorization", adminToken);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(404);
    });

    it("GET /schedules/properties/:id - Should NOT be able to list the schedules of a property without authentication", async () => {
        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const address = addressesRepository.create({
            ...mockedProperty.address,
        });
        await addressesRepository.save(address);

        const property = propertiesRepository.create({
            ...mockedProperty,
            address,
            category,
        });
        await propertiesRepository.save(property);

        const response = await request(app).get(
            `/schedules/properties/${property.id}`
        );

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(401);
    });

    it("GET /schedules/properties/:id - Should NOT be able to list the schedules of a property that the user doesn't own", async () => {
        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const userLoginResponse = await request(app)
            .post("/login")
            .send(mockedUserLogin);
        const userToken = `Bearer ${userLoginResponse.body.token}`;

        const userThatOwnsProperty = usersRepository.create({
            ...mockedUser,
            email: "anotheremail@mail.com.br",
        });
        await usersRepository.save(userThatOwnsProperty);

        const category = categoriesRepository.create(mockedCategory);
        await categoriesRepository.save(category);

        const address = addressesRepository.create({
            ...mockedProperty.address,
        });
        await addressesRepository.save(address);

        const property = propertiesRepository.create({
            ...mockedProperty,
            address,
            category,
        });
        await propertiesRepository.save(property);

        const schedule = schedulesRepository.create({
            ...mockedSchedule,
            user: userThatOwnsProperty,
            properties: property,
        });
        await schedulesRepository.save(schedule);

        const response = await request(app)
            .get(`/schedules/properties/${property.id}`)
            .set("Authorization", userToken);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(403);
    });
});

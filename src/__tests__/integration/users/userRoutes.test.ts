import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import {
    mockedAdmin,
    mockedAdminLogin,
    mockedInvalidId,
    mockedUpdateUser,
    mockedUser,
    mockedUserLogin,
} from "../../mocks";
import { User } from "../../../entities/users";
import { getRounds } from "bcryptjs";

describe("/users", () => {
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
    });

    beforeEach(async () => {
        await usersRepository.clear();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    it("POST /users - Should be able to create an user", async () => {
        const response = await request(app).post("/users").send(mockedUser);

        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("email");
        expect(response.body).toHaveProperty("isAdm");
        expect(response.body).toHaveProperty("isActive");
        expect(response.body).toHaveProperty("createdAt");
        expect(response.body).toHaveProperty("updatedAt");
        expect(response.body).not.toHaveProperty("password");
        expect(response.body.name).toEqual("Joana");
        expect(response.body.email).toEqual("joana@mail.com");
        expect(response.body.isAdm).toEqual(false);
        expect(response.body.isActive).toEqual(true);
        expect(response.status).toBe(201);
    });

    it("POST /users - Should NOT be able to create an user that already exists", async () => {
        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const response = await request(app).post("/users").send(mockedUser);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(409);
    });

    it("GET /users - Should be able to list all users", async () => {
        const admin = usersRepository.create(mockedAdmin);
        await usersRepository.save(admin);

        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const response = await request(app)
            .get("/users")
            .set("Authorization", adminToken);

        const userInDatabase = await usersRepository.findOneBy({
            id: admin.id,
        });
        const isPasswordHashed = getRounds(userInDatabase.password);

        expect(response.body).toHaveLength(1);
        expect(response.body[0]).not.toHaveProperty("password");
        expect(isPasswordHashed).toBeTruthy();
        expect(response.status).toBe(200);
    });

    it("GET /users - Should NOT be able to list users without authentication", async () => {
        const response = await request(app).get("/users");

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(401);
    });

    it("GET /users - Should NOT be able to list users not being admin", async () => {
        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const userLoginResponse = await request(app)
            .post("/login")
            .send(mockedUserLogin);
        const userToken = `Bearer ${userLoginResponse.body.token}`;

        const response = await request(app)
            .get("/users")
            .set("Authorization", userToken);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(403);
    });

    it("DELETE /users/:id - Should be able to soft delete user", async () => {
        const admin = usersRepository.create(mockedAdmin);
        await usersRepository.save(admin);

        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const userToBeDeleted = usersRepository.create(mockedUser);
        await usersRepository.save(userToBeDeleted);

        const response = await request(app)
            .delete(`/users/${userToBeDeleted.id}`)
            .set("Authorization", adminToken);

        const userInDatabase = await usersRepository.findOneBy({
            id: userToBeDeleted.id,
        });

        expect(userInDatabase.isActive).toBe(false);
        expect(response.status).toBe(204);
    });

    it("DELETE /users/:id - Should NOT be able to delete user without authentication", async () => {
        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const response = await request(app).delete(`/users/${user.id}`);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(401);
    });

    it("DELETE /users/:id - Should NOT be able to delete user not being admin", async () => {
        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const userLoginResponse = await request(app)
            .post("/login")
            .send(mockedUserLogin);
        const userToken = `Bearer ${userLoginResponse.body.token}`;

        const userToBeDeleted = usersRepository.create(mockedAdmin);
        await usersRepository.save(userToBeDeleted);

        const response = await request(app)
            .delete(`/users/${userToBeDeleted.id}`)
            .set("Authorization", userToken);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(403);
    });

    it("DELETE /users/:id - Should NOT be able to delete user with isActive = false", async () => {
        const admin = usersRepository.create(mockedAdmin);
        await usersRepository.save(admin);

        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const userToBeDeleted = usersRepository.create({
            ...mockedUser,
            isActive: false,
        });
        await usersRepository.save(userToBeDeleted);

        const response = await request(app)
            .delete(`/users/${userToBeDeleted.id}`)
            .set("Authorization", adminToken);

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty("message");
    });

    it("DELETE /users/:id - Should NOT be able to delete user with invalid id", async () => {
        const admin = usersRepository.create(mockedAdmin);
        await usersRepository.save(admin);

        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const response = await request(app)
            .delete(`/users/${mockedInvalidId}`)
            .set("Authorization", adminToken);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(404);
    });

    it("PATCH /users/:id - Should be able to update user", async () => {
        const admin = usersRepository.create(mockedAdmin);
        await usersRepository.save(admin);

        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const response = await request(app)
            .patch(`/users/${admin.id}`)
            .set("Authorization", adminToken)
            .send(mockedUpdateUser);

        const userInDatabase = await usersRepository.findOneBy({
            id: admin.id,
        });

        expect(userInDatabase.name).toBe(mockedUpdateUser.name);
        expect(userInDatabase.email).toBe(mockedUpdateUser.email);
        expect(response.status).toBe(200);
    });

    it("PATCH /users/:id - Should NOT be able to update user without authentication", async () => {
        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const response = await request(app).patch(`/users/${user.id}`);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(401);
    });

    it("PATCH /users/:id - Should NOT be able to update user with invalid id", async () => {
        const admin = usersRepository.create(mockedAdmin);
        await usersRepository.save(admin);

        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const response = await request(app)
            .patch(`/users/${mockedInvalidId}`)
            .set("Authorization", adminToken)
            .send(mockedUpdateUser);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(404);
    });

    it("PATCH /users/:id - Should NOT be able to update isAdm field value", async () => {
        const admin = usersRepository.create(mockedAdmin);
        await usersRepository.save(admin);

        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const response = await request(app)
            .patch(`/users/${user.id}`)
            .set("Authorization", adminToken)
            .send({ ...mockedUpdateUser, isAdm: true });

        const userInDatabase = await usersRepository.findOneBy({ id: user.id });

        expect(userInDatabase.isAdm).toBeFalsy();
        expect(response.status).toBe(200);
    });

    it("PATCH /users/:id - Should NOT be able to update isActive field value", async () => {
        const admin = usersRepository.create(mockedAdmin);
        await usersRepository.save(admin);

        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const response = await request(app)
            .patch(`/users/${user.id}`)
            .set("Authorization", adminToken)
            .send({ ...mockedUpdateUser, isActive: false });

        const userInDatabase = await usersRepository.findOneBy({ id: user.id });

        expect(userInDatabase.isActive).toBeTruthy();
        expect(response.status).toBe(200);
    });

    it("PATCH /users/:id - Should NOT be able to update id field value", async () => {
        const admin = usersRepository.create(mockedAdmin);
        await usersRepository.save(admin);

        const adminLoginResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const adminToken = `Bearer ${adminLoginResponse.body.token}`;

        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const response = await request(app)
            .patch(`/users/${user.id}`)
            .set("Authorization", adminToken)
            .send({ ...mockedUpdateUser, id: mockedInvalidId });

        const userInDatabase = await usersRepository.findOneBy({ id: user.id });

        expect(userInDatabase.id).not.toBe(mockedInvalidId);
        expect(response.status).toBe(200);
    });

    it("PATCH /users/:id - Should NOT be able to update another user without adm permission", async () => {
        const user = usersRepository.create(mockedUser);
        await usersRepository.save(user);

        const userAdminResponse = await request(app)
            .post("/login")
            .send(mockedAdminLogin);
        const userToken = `Bearer ${userAdminResponse.body.token}`;

        const userToBeUpdated = usersRepository.create(mockedAdmin);
        await usersRepository.save(userToBeUpdated);

        const response = await request(app)
            .patch(`/users/${userToBeUpdated.id}`)
            .set("Authorization", userToken)
            .send(mockedUpdateUser);

        expect(response.body).toHaveProperty("message");
        expect(response.status).toBe(401);
    });
});

import "express-async-errors";
import "reflect-metadata";
import express from "express";
import {
    usersRoutes,
    categoriesRoutes,
    commonRoutes,
    propertiesRoutes,
    schedulesRoutes,
} from "./routes/imports";
import { errorHandler } from "./errorGlobal/errorHandler";

const app = express();
app.use(express.json());
app.use("/users", usersRoutes);
app.use("/login", commonRoutes);
app.use("/categories", categoriesRoutes);
app.use("/properties", propertiesRoutes);
app.use("/schedules", schedulesRoutes);
app.use(errorHandler);

export default app;

import "express-async-errors";
import "reflect-metadata";
import express from "express";
import { usersRoutes } from "./routes/users";
import { commonRoutes } from "./routes/login";
import { errorHandler } from "./errorGlobal/errorHandler";
import { categoriesRoutes } from "./routes/categories";
import { propertiesRoutes } from "./routes/properties";
import { schedulesRoutes } from "./routes/schedules";

const app = express();
app.use(express.json());

app.use("/users", usersRoutes);
app.use("/login", commonRoutes);
app.use("/categories", categoriesRoutes);
app.use("/properties", propertiesRoutes);
app.use("/schedules", schedulesRoutes);
app.use(errorHandler);
export default app;

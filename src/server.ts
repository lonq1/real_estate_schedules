import app from "./app";
import AppDataSource from "./data-source";

(async () => {
    await AppDataSource.initialize().catch((err) => {
        console.error("Error during Data Source initialization", err);
    });

    app.listen(process.env.SERVERPORT, () => {
        console.log(`Server running in port ${process.env.SERVERPORT}`);
    });
})();

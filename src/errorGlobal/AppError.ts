export class AppError extends Error {
    statusCode: number;

    constructor(statusCode = 400, message: string) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

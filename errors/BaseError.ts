export default class BaseError extends Error {
    public message: string;
    public statusCode: number;
    public errors = {};
    constructor(message: string, statusCode: number) {
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.errors = {};
    }
}

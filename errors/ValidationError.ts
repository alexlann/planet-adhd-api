import BaseError from "./BaseError";

export default class ValidationError extends BaseError {
    constructor(errors: {}) {
        super("Validation failed", 400);
        this.errors = errors;
    }
}

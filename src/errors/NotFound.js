export class NotFound extends Error {
    constructor(page, method) {
        super(`Page ${page} not found, with method ${method}`);
    }
}
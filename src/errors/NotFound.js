export class NotFound extends Error {
    constructor(page) {
        super(`Page ${page} not found`);
    }
}
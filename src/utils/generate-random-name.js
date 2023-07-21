import crypto from "crypto";

export const generateRandomName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
    
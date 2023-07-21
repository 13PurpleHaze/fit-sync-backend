import jwt from "jsonwebtoken";
import 'dotenv/config';

export const sign = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: `${process.env.JWT_ACCESS_EXPITES_IN_MINUTES}m`,
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: `${process.env.JWT_REFRESH_EXPITES_IN_DAYS}d`,
    })

    return {accessToken, refreshToken};
}
import UserDAL from "../data-layer/UserDAL.js";
import client from "../redis.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { BadRequest } from "../errors/BadRequest.js";
import { contextsKey } from "express-validator/src/base.js";
import { Unauthorized } from "../errors/Unauthorized.js";

class AuthController {
    user;

    constructor() {
        this.user = new UserDAL();
    }

    register = async (req, res) => {
        const {
            login,
            password,
            first_name,
            sur_name,
            age,
            gender,
        } = req.body;
        const hashPassword = await bcrypt.hash(String(password), 9);
        const user = await this.user.create({
            login,
            password: hashPassword,
            first_name,
            sur_name,
            age,
            gender,
        });
        
        const tokens = this.sign(user);
        await client.setEx(user.user_id, 3*24*60*60, tokens.refreshToken);
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            signed: true,
            age: 3 * 24 * 60 * 60 * 1000,
            path: "/auth/refresh",
        })
        res.status(201).json({accessToken: tokens.accessToken});
    }

    login = async (req, res) => {
        const {login, password} = req.body;

        const user = await this.user.find(login);
        if(!bcrypt.compare(password, user.password)) {
            throw new BadRequest('Wrong password');
        }

        const tokens = this.sign(user);
        await client.setEx(user.user_id, 3*24*60*60, tokens.refreshToken);
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            signed: true,
            age: 3 * 24 * 60 * 60 * 1000,
            path: "/api/auth/refresh",
        })
        res.status(201).json({accessToken: tokens.accessToken});
    }

    logout = async (req, res) => {
        await client.del(req.user.user_id);
        res.clearCookie('refreshToken');
        res.status(200).send();
    }

    refresh = async (req, res) => {
        const {refreshToken} = req.signedCookies;
        const payload = jwt.verify(refreshToken, "REFRESH_SECRET_KEY");

        const oldRefreshToken = await client.get(payload.user_id);
        if(!oldRefreshToken && oldRefreshToken !== refreshToken) {
            throw new Unauthorized();
        }

        const tokens = this.sign({user_id: payload.user_id});
        
        await client.setEx(payload.user_id, 3*24*60*60, tokens.refreshToken);
        
        res.clearCookie('refreshToken');
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            signed: true,
            age: 3 * 24 * 60 * 60 * 1000,
            path: "/api/auth/refresh",
        })
        res.status(201).json({accessToken: tokens.accessToken});
    }


    sign = (payload) => {
        
        const accessToken = jwt.sign(payload, 'ACCESS_SECRET_KEY', {
            expiresIn: '3m',
        });
    
        const refreshToken = jwt.sign(payload, 'REFRESH_SECRET_KEY', {
            expiresIn: '3d',
        })

        return {accessToken, refreshToken};
    }
}

export default AuthController;
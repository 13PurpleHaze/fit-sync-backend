import UserDAL from "../data-access-layer/UserDAL.js";
import broker from "../broker.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { BadRequest } from "../errors/BadRequest.js";
import { Unauthorized } from "../errors/Unauthorized.js";
import 'dotenv/config';

class AuthController {
    constructor() {
        this.users = new UserDAL();
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

        const user = await this.users.create({
            login,
            password,
            first_name,
            sur_name,
            age,
            gender,
        });

        const tokens = this.sign({user_id: user.user_id, role_id: user.role_id, login: user.login});
        await broker.pub.hSet('refreshTokens', { [user.user_id]: tokens.refreshToken});
        
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            signed: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            path: "/"
        })
        res.status(201).json({accessToken: tokens.accessToken});
    }

    login = async (req, res) => {
        const {login, password} = req.body;
        const [user] = await this.users.get({
            filters: [{login}]
        });
        if(!bcrypt.compare(String(password), user.password)) {
            throw new BadRequest('Wrong password');
        }

        const tokens = this.sign({user_id: user.user_id, role_id: user.role_id, login: user.login});
        await broker.pub.hSet('refreshTokens', { [user.user_id]: tokens.refreshToken});
        
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            signed: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            path: "/"
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

        if(!refreshToken) {
            throw new Unauthorized();
        }

        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const oldRefreshToken = await broker.pub.hGet('refreshTokens', payload.user_id);

        if(!oldRefreshToken || oldRefreshToken !== refreshToken) {
            throw new Unauthorized();
        }

        const tokens = this.sign({user_id: payload.user_id, role_id: payload.role_id, login: payload.login});
        await broker.pub.hSet('refreshTokens', { [payload.user_id]: tokens.refreshToken});
        
        res.clearCookie('refreshToken');
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            signed: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            path: "/"
        })
        res.status(201).json({accessToken: tokens.accessToken});
    }


    sign = (payload) => {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: `${process.env.JWT_ACCESS_EXPITES_IN_MINUTES}m`,
        });
    
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: `${process.env.JWT_REFRESH_EXPITES_IN_DAYS}d`,
        })

        return {accessToken, refreshToken};
    }
}

export default AuthController;
import UserDAL from "../data-access-layer/UserDAL.js";
import broker from "../broker.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { BadRequest } from "../errors/BadRequest.js";
import { Unauthorized } from "../errors/Unauthorized.js";
import { sign } from "../utils/sign.js";
import "dotenv/config";

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

        const tokens = sign({user_id: user.user_id, role_id: user.role_id, login: user.login, status: true});
        await broker.pub.hSet('refreshTokens', { [user.user_id]: tokens.refreshToken});
        
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            signed: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            path: '/'
        })
        res.status(201).json({accessToken: tokens.accessToken});
    }

    login = async (req, res) => {
        const {login, password} = req.body;
        const [user] = await this.users.get({
            filters: [{login}]
        });
    
        
        if(!user || !(await bcrypt.compare(String(password), user.password))) {
            throw new BadRequest('Wrong password or login');
        }

        if(!user.status) {
            throw new BadRequest('You are blocked');
        }

        const tokens = sign({user_id: user.user_id, role_id: user.role_id, login: user.login, status: user.status});
        await broker.pub.hSet('refreshTokens', { [user.user_id]: tokens.refreshToken});
        
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            signed: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            path: "/"
        })
        res.status(201).json({accessToken: tokens.accessToken});
    }

    logout = async (req, res) => {
        await broker.pub.hDel('refreshTokens', req.user.user_id);
        res.clearCookie('refreshToken');
        res.status(200).send();
    }

    refresh = async (req, res) => {
        const {refreshToken} = req.signedCookies;

        if(!refreshToken) {
            throw new Unauthorized();
        }

        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        if(!payload.status) {
            throw new Unauthorized();
        }

        const oldRefreshToken = await broker.pub.hGet('refreshTokens', payload.user_id);

        if(!oldRefreshToken || oldRefreshToken !== refreshToken) {
            throw new Unauthorized();
        }

        const tokens = sign({user_id: payload.user_id, role_id: payload.role_id, login: payload.login, status: payload.status});
        await broker.pub.hSet('refreshTokens', { [payload.user_id]: tokens.refreshToken});
        
        res.clearCookie('refreshToken');
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            signed: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            path: '/'
        })
        res.status(201).json({accessToken: tokens.accessToken});
    }
}

export default AuthController;
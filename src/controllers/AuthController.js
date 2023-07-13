import UserDAL from "../data-access-layer/UserDAL.js";
import client from "../redis.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { BadRequest } from "../errors/BadRequest.js";
import { Unauthorized } from "../errors/Unauthorized.js";

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

        const tokens = this.sign({user_id: user.user_id, role_id: user.role_id});
        await client.setEx(user.user_id, 3*24*60*60, tokens.refreshToken);
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
        const [user] = await this.users.get([{column: 'login', operator: '=', value: login}]);
        if(!bcrypt.compare(String(password), user.password)) {
            throw new BadRequest('Wrong password');
        }

        const tokens = this.sign({user_id: user.user_id, role_id: user.role_id});
        await client.setEx(user.user_id, 3*24*60*60, tokens.refreshToken);

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

        const payload = jwt.verify(refreshToken, "REFRESH_SECRET_KEY");
        const oldRefreshToken = await client.get(payload.user_id);

        if(!oldRefreshToken && oldRefreshToken !== refreshToken) {
            throw new Unauthorized();
        }

        const tokens = this.sign({user_id: payload.user_id, role_id: payload.role_id});
        await client.setEx(payload.user_id, 3*24*60*60, tokens.refreshToken);
        
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
        const accessToken = jwt.sign(payload, 'ACCESS_SECRET_KEY', {
            expiresIn: '15s',
        });
    
        const refreshToken = jwt.sign(payload, 'REFRESH_SECRET_KEY', {
            expiresIn: '3d',
        })

        return {accessToken, refreshToken};
    }
}

export default AuthController;
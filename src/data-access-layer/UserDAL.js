import db from "../db.js";
import bcrypt from "bcrypt";
import { BadRequest } from "../errors/BadRequest.js";
import BaseDAL from "../base/BaseDAL.js";

class UserDAL extends BaseDAL {
    create = async (data) => {
        const [user] = await db('users').where('login', data.login);
        if(user) {
            throw new BadRequest('There is another user with this login');
        } else {
            const [user] = await db('users').insert({
                ...data,
                password: await bcrypt.hash(data.password, 8)
            }).returning("*");
            return user;
        }
    }

    find = async (userId) => {
        const [user] = await this.get({
            filters: [{user_id: userId}]
        });
        if(!user) {
            throw new BadRequest('There is no user with this login');
        } else {
            return user;
        }
    }

    get = async ({filters = [], sort = ['user_id'], limit = 10, page = 1}) => {
        const query = db('users');
        const users = await this.getPaginatedFilteredSorted(query, filters, sort, limit, page);
        return users;
    }

    changeBlockStatus = async (userId, status = false) => {
        const user = await this.find(userId);
        await db('users').where('user_id', userId).update({status, updated_at: new Date()});
    }

    getTotal = async () => {
        const [{count}] =  await db('users').count();
        return {totalCount: count};
    }
}

export default UserDAL;
import db from "../db.js";
import { BadRequest } from "../errors/BadRequest.js";

class UserDAL {
    create = async (newUser) => {
        const user = await db('user_details').where('login', newUser.login).first();
        if(user) {
            throw new BadRequest('There is another user with this login');
        } else {
            return await db.transaction(async trx => {
                const result = await db('users').insert({
                    first_name: newUser.first_name,
                    sur_name: newUser.sur_name,
                    age: newUser.age,
                    gender: newUser.gender
                }).returning('*').transacting(trx);
                
                await db('user_details').insert({
                    user_id: result[0].user_id,
                    login: newUser.login,
                    password: newUser.password,
                }).transacting(trx);
                
                return result[0];
            })
        }
    }

    find = async (login) => {
        const user = await db('user_details').where('login', login).first();
        if(!user) {
            throw new BadRequest('There is no user with this login');
        } else {
            return user;
        }
    }
}

export default UserDAL;
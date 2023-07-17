import BaseDAL from "../base/BaseDAL.js";
import db from "../db.js";

class MessageDAL extends BaseDAL{
    constructor() {
        super();
    }

    create = async (data) => {
        const [message] = await db('messages').insert(data).returning('*');
        return message;
    }
}

export default MessageDAL;

import db from "../db.js";

class SessionDAL {
    create = async (data) => {
        const [session] = await db('sessions').insert({workout_id: data.workoutId}).returning("*");
        return session;
    }
}

export default SessionDAL;
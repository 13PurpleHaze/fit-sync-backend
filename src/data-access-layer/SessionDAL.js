import db from "../db.js";

class SessionDAL {
    create = async (data) => {
        return await db.transaction(async trx => {
            const [session] = await db('sessions')
                .insert({workout_id: data.workoutId})
                .returning("*")
                .transacting(trx);

            const [user] = await db('session_users')
                .insert({session_id: session.session_id, user_id: data.userId})
                .returning("*")
                .transacting(trx);
            
           
            const [exercises] = await Promise.all(data.exercises.map(async exs => {
                const [res] = await db('user_exercises')
                    .insert({session_id: session.session_id, user_id: data.userId, exercise_id: exs.exercise_id, reps: 0})
                    .returning('*')
                    .transacting(trx);
                return res;
            }));

            return {...session, user_id: user.user_id}
        });
    }

    doExs = async (data) => {
        await db('user_exercises')
            .where({session_id: data.sessionId, user_id: data.userId, exercise_id: data.exerciseId})
            .update({reps: data.reps});
    }
}

export default SessionDAL;
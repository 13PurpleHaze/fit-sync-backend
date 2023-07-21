import db from "../db.js";

class SessionDAL {
    create = async (data) => {
        return await db.transaction(async trx => {
            const [session] = await db('sessions')
                .insert({workout_id: data.workout_id})
                .returning('*')
                .transacting(trx);

            const [user] = await db('session_users')
                .insert({session_id: session.session_id, user_id: data.userId})
                .returning('*')
                .transacting(trx);
            
           
            const [exercises] = await Promise.all(data.exercises.map(async exs => {
                const [res] = await db('user_exercises')
                    .insert({session_id: session.session_id, user_id: data.userId, exercise_id: exs.exercise_id, reps: 0})
                    .returning('*')
                    .transacting(trx);
                return res;
            }));

            return {...session, workout: {workout_id: data.workout_id, title: data.title, exercises}};
        });
    }

    get = async () => {
        const sessions = await db('sessions')
            .where({session_id: data.sessionId})
            .join('user_exercises', 'user_exercises.session_id', '=', 'session.session_id')
            .where({user_id: data.userId})
            .returning(['sessions.session_id', 'user_id', 'exercise_id', 'reps']);
        
            
        const [session] = await db('sessions')
                .where({workout_id: data.workout_id})
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
    }

    doExs = async (data) => {
        await db('user_exercises')
            .where({session_id: data.sessionId, user_id: data.userId, exercise_id: data.exerciseId})
            .update({reps: data.reps});
    }

    finishWorkout = async (sessionId, userId) => {
        await db('session_users').where({user_id: userId, session_id: sessionId}).update({is_finished: true, date_end: new Date()});
    }

    startWorkout = async (sessionId, userId) => {
        await db('session_users').where({user_id: userId, session_id: sessionId}).update({date_start: new Date()})
    }

    addPerson = async ({sessionId, workout, userId}) => {
        await db.transaction(async trx => {
            const [user] = await db('session_users')
                .insert({session_id: sessionId, user_id: userId})
                .returning("*")
                .transacting(trx);
            
           
            const [exercises] = await Promise.all(workout.exercises.map(async exs => {
                const [res] = await db('user_exercises')
                    .insert({session_id: sessionId, user_id: userId, exercise_id: exs.exercise_id, reps: 0})
                    .returning('*')
                    .transacting(trx);
                return res;
            }));
        });
    }
}

export default SessionDAL;
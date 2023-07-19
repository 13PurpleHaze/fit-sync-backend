import SessionDAL from "../data-access-layer/SessionDAL.js";
import WorkoutDAL from "../data-access-layer/WorkoutDAL.js";
import MessageDAL from "../data-access-layer/MessageDAL.js";
import UserDAL from "../data-access-layer/UserDAL.js";
import ActiveUsers from "./users.js";

class Session {
    constructor(io) {
        this.io = io;
        this.sessions = new SessionDAL();
        this.workouts = new WorkoutDAL();
        this.messages = new MessageDAL();
        this.users = new UserDAL();
        this.activeUsers = new ActiveUsers();
    }

    onConnection = async (socket) => {
        socket.on('session:create', async (workout) => {
            const _workout = await this.workouts.find(workout.workout_id, socket.user.user_id);
            if(!_workout) {
                socket.emit('error', {error: `Тренировки ${workout.workout_id} не существует`});
                return;
            }
            const session = await this.sessions.create({...workout, userId: socket.user.user_id});
            socket.join(`session#${session.session_id}`);
            const results = [];
            for(let exercise of workout.exercises) {
                results.push({[exercise.exercise_id]: 0})
            }
            socket.emit('session:created', {...session, workout, users: [{...socket.user, results}]});
        });
        socket.on('session:do-exs', async ({reps, exerciseId, sessionId}) => {
            if (!reps) {
                reps = 0;
            }
            await this.sessions.doExs({reps, exerciseId, sessionId, userId: socket.user.user_id });
            this.io.to(`session#${sessionId}`).emit('session:done-exs', {userId: socket.user.user_id, reps, exerciseId});
        });
        socket.on('session:start', async (session) => {
            await this.sessions.startWorkout(session.session_id, socket.user.user_id);
        });
        socket.on('session:finish', async (session) => {
            await this.sessions.finishWorkout(session.session_id, socket.user.user_id)
            socket.emit('session:finished', session);
        });
        socket.on('message:send', async ({session, text}) => {
            const message = await this.messages.create({session_id: session.session_id, user_id: socket.user.user_id, text});
            this.io.to(`session#${session.session_id}`).emit('message:sent', {...message, user: socket.user});
        });
        socket.on('disconnect', async () => {
            console.log('diss')
            // find sessions with curr user
            // if found and it not finished -> finished
            socket.emit('session:finished');
        })
    }
}

export default Session;
import SessionDAL from "../data-access-layer/SessionDAL.js";
import WorkoutDAL from "../data-access-layer/WorkoutDAL.js";
import ExerciseDAL from "../data-access-layer/ExerciseDAL.js";
import MessageDAL from "../data-access-layer/MessageDAL.js";

class Session {
    constructor(io) {
        this.io = io;
    }

    onConnection = async (socket) => {
        socket.on('session:create', async ({workoutId, userId, exercises}) => {
            console.log(workoutId, userId);

            const workouts = new WorkoutDAL();
            const workout = await workouts.find(workoutId, userId);

            const sessionDAL = new SessionDAL();
            const session = await sessionDAL.create({workoutId, userId, exercises});
            
            console.log(session);
            
            socket.join(`session#${session.session_id}`);
            socket.emit('session:created', session);
        });
        socket.on('session:do-exs', async ({reps, exerciseId, sessionId, userId}) => {
            if (!reps) {
                reps = 0;
            }
            const sessionDAL = new SessionDAL();
            sessionDAL.doExs({reps, exerciseId, sessionId, userId })
        })
        socket.on('message:send', async ({session, user_id, text}) => {
            const msg = new MessageDAL();
            const message = await msg.create({session_id: session.session_id, user_id, text});
            this.io.to(`session#${session.session_id}`).emit('message:sent', message);
        })
    }
}

export default Session;
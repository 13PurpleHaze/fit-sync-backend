import SessionDAL from "../data-access-layer/SessionDAL.js";
import WorkoutDAL from "../data-access-layer/WorkoutDAL.js";
import ExerciseDAL from "../data-access-layer/ExerciseDAL.js";

class Session {
    constructor(io) {
        this.io = io;
    }

    onConnection = async (socket) => {
        socket.on('session:create', async (workoutId) => {
            const sessionDAL = new SessionDAL();
            const session = await sessionDAL.create(workoutId);
            socket.join(`session#${session.session_id}`);
            socket.emit('session:created', session);
        });
    }
}

export default Session;
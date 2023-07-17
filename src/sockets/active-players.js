import SessionDAL from "../data-access-layer/SessionDAL.js";
import WorkoutDAL from "../data-access-layer/WorkoutDAL.js";
import ExerciseDAL from "../data-access-layer/ExerciseDAL.js";

class ActivePlayers {
    constructor(io) {
        this.io = io;
    }

    onConnection = async (socket) => {
        setInterval(async() => {
            const sockets = await this.io.fetchSockets();
            const players = [];
            for(let s of sockets) {
                const [rooms] = Array.from(s.rooms).find(room => !(/session\#\d+/).test(room) );
                if(rooms.length === s.rooms.size) {
                    players.push({
                        id: s.id,
                        login: s.user.login,
                        roomsnew: rooms,
                        roomsOld: s.rooms,
                    })
                }
            }
            socket.emit('active-users:get', players);
        }, 2500)

        socket.on('active-users:invite', ({session, from, to}) => {
            this.io.to(to).emit('active-users:invited', {session, from, to});
        })

        socket.on('active-users:accept', async ({session, from, to}) => {
            socket.join(`session#${session.session_id}`);
            socket.emit('session:created', session)
        })
    }
}

export default ActivePlayers;
import SessionDAL from "../data-access-layer/SessionDAL.js";

class ActiveUsers {
    constructor(io) {
        this.io = io;
        this.sessions = new SessionDAL();
    }

    getActiveUsers = async () => {
        const sockets = await this.io.fetchSockets();
        const players = [];
        for(let s of sockets) {
            const [rooms] = Array.from(s.rooms).find(room => !(/session\#\d+/).test(room) );
            if(rooms.length === s.rooms.size) {
                players.push({
                    userId: s.user.user_id,
                    socketId: s.id,
                    login: s.user.login,
                })
            }
        }
        return players;
    }

    onConnection = async (socket) => {
        setInterval(async() => {
            const players = await this.getActiveUsers();
            socket.emit('active-users:get', players);
        }, 2500)

        socket.on('active-users:invite', ({session, from, to}) => {
            const count = this.io.sockets.adapter.rooms.get(`session#${session.session_id}`)?.size;
            if(count && count < 5) {
                this.io.to(to.socketId).emit('active-users:invited', {session, from, to});
            } else {
                socket.emit('error', {code: 'ERROR_INVITE',response: {data:{error: 'Up to 5 people can participate in one training'}}});    
            }
        });

        socket.on('active-users:accept', async ({session, from, to}) => {
            const results = [];
            for(let exercise of session.workout.exercises) {
                results.push({[exercise.exercise_id]: 0})
            }
            await this.sessions.addPerson({sessionId: session.session_id, workout: session.workout, userId: socket.user.user_id});
            socket.join(`session#${session.session_id}`);
            socket.emit('session:created', session);
            this.io.to(`session#${session.session_id}`).emit('users:accepted', {...socket.user, results});
        });
    }
}

export default ActiveUsers;
class ActiveUsers {
    constructor(io) {
        this.io = io;
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

        socket.on('active-users:invite', ({session, from, toSocketId}) => {
            const count = this.io.sockets.adapter.rooms.get(`session#${session.session_id}`)?.size;
            if(false) {
                socket.emit('error', {code: 'ERROR_INVITE',response: {data:{error: 'В одной тренировке может участвовать до 5 человек'}}});
            } else {
                this.io.to(toSocketId).emit('active-users:invited', {session, from, toSocketId});
            }
        });

        socket.on('active-users:accept', async ({session, toSocketId}) => {
            const results = [];
            for(let exercise of session.workout.exercises) {
                results.push({[exercise.exercise_id]: 0})
            }
            socket.join(`session#${session.session_id}`);
            socket.emit('session:created', session);
            this.io.to(`session#${session.session_id}`).emit('users:accepted', {...socket.user, results});
        });

        socket.on('active-users:reject', async ({session, fromSocket}) => {
            this.io.to(fromSocket).emit('active-users:rejected', {user: socket.user});
        });
    }
}

export default ActiveUsers;
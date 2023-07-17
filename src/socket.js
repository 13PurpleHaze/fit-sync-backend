import { Server } from "socket.io";
import { auth } from "./middlewares/auth.js";
import Session from "./sockets/session.js";
import ActivePlayers from "./sockets/active-players.js";
import { createAdapter } from "@socket.io/redis-adapter";
import broker from "./broker.js";

export const initSockets = (server) => {
    const io = new Server(
        server,
        {
          transports: ['websocket']
        }
      );

    io.adapter(createAdapter(broker.pub, broker.sub))
    io.use((socket, next) => {
        const req = {headers: { authorization: `Bearer ${socket.handshake?.auth.token}` }}
        auth(req, null, next);
        if (!req?.user){
            socket.disconnect();
        } else {
            socket.user = req.user;
            next();
        }    
    });
    
    const session = new Session(io); 
    const players = new ActivePlayers(io);
    
    io.on("connection",  async (socket) => {
        await Promise.all(
            [
                await session.onConnection(socket),
                await players.onConnection(socket),
            ]
        )
    });

    return io;
}

const validateSocket = (socket) => {
    if(socket.request.user.exp  < (new Date().getTime()/1000)) {
        socket.disconnect();
        
    }
}

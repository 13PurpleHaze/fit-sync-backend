import { Server } from "socket.io";
import { auth } from "./middlewares/auth.js";
import Session from "./sockets/session.js";
import Users from "./sockets/users.js";
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
        socket.headers = { authorization: `Bearer ${socket.handshake?.auth.token}` }
        auth(socket, null, next);    
    });
    
    const session = new Session(io); 
    const users = new Users(io);
    
    io.on('connection',  async (socket) => {
        session.onConnection(socket);
        users.onConnection(socket);
    });
}

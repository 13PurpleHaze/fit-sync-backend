import { Server } from "socket.io";
import { wrapper } from "./utils/wrapper.js";
import { auth } from "./middlewares/auth.js";
import Session from "./sockets/session.js";

export const io = (server) => {

    const io = new Server(
        server,
        {
          transports: ['websocket']
        }
      );
    /*io.use((socket, next) => {
        console.log('проверка')
        const req = {headers: { authorization: `Bearer ${socket.handshake?.auth.token}` }}
            auth(req, null,next);
            if (!socket.request?.user){
                console.log('ДИСКОНЕКТ')
                socket.disconnect();
            } else {
                next();
            }
        }
    );*/
    
    const session = new Session(io); 

    
    io.on("connection",  async (socket) => {
        console.log('connection');
        await session.onConnection(socket);
    });

    return io;
}

const validateSocket = (socket) => {
    if(socket.request.user.exp  < (new Date().getTime()/1000)) {
        socket.disconnect();
        
    }
}

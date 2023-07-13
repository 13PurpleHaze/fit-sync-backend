export const wrapper = (middleware) => (socket, next) => 
    middleware(socket.request, null, next)
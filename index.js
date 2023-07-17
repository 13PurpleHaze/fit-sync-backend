import server from "./src/app.js";

process.on('SIGINT', async () => {
    try {
        await server.close();
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
})

server.listen(process.env.APP_PORT || 8080, () => {
    process.send('ready');
});
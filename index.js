import server from "./src/app.js";
import db from "./src/db.js";
import broker from "./src/broker.js";

process.on('SIGINT', async () => {
    try {
        await Promise.all([
            await server.close(),
            await db.destroy(),
            await broker.pub.disconnect(),
            await broker.sub.disconnect(),
        ]);
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
})

server.listen(process.env.APP_PORT || 8080, () => {
    process.send('ready');
});
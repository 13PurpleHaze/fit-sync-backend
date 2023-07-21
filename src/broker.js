import { createClient } from "redis";
import "dotenv/config";

const pub = createClient({url: process.env.REDIS_URL});
const sub = pub.duplicate();

await Promise.all([
    await pub.connect(),
    await sub.connect()
]);

export default {pub, sub};
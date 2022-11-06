import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();
var client = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
    }
});
client.on('error', function (err) { return console.error(err); });
client.connect();
export default client;
//# sourceMappingURL=redisManager.js.map
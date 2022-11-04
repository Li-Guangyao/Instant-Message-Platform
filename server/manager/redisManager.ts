import redis, {createClient} from 'redis';
import dotenv from 'dotenv'
dotenv.config();

const client = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
    },
    // password: process.env.REDIS_PW
});

client.on('error', (err) => console.error(err));
client.connect();

export default client ;
import { createClient } from "redis";

class Redis {
    constructor() {
        if (process.env.REDIS_PROVIDER) {
            this.client = createClient(process.env.REDIS_PROVIDER);
        } else {
            this.client = createClient();
        }
        this.client = createClient(process.env.REDIS_PROVIDER);
        // https://stackoverflow.com/questions/53104472/node-redis-updating-used-memory-info
        setInterval(() => {
            this.client.info((req, res) => {
                res.split("\n").map((line) => {
                    if (line.match(/used_memory_human/)) {
                        console.log("Used memory: " + line.split(":")[1]);
                    }
                });
            });
        }, 10000);

        this.client.on("error", (err) => {
            console.error(err);
        });
    }

    retrieve(key, cb) {
        this.client.get(key, cb);
    }

    store(key, value) {
        this.client.set(key, value);
    }

    delete(key) {
        this.client.del(key);
    }

    addListener(event, fn) {
        this.client.on(event, fn);
    }
}

const instance = new Redis();
Object.freeze(instance);

export default instance;

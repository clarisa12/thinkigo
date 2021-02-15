import { createClient } from "redis";

class Redis {
    constructor() {
        this.client = createClient();

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

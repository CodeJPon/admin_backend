const Cache = require('node-cache');

class MemoryCache {
    #prefixKey;
    #cache;

    constructor (prefixKey = '', stdTTL = 60 * 60) {
        if (prefixKey !== '' && prefixKey.substring(-1) !== ':') {
            prefixKey += ':';
        }
        this.#prefixKey = prefixKey;
        this.#cache = new Cache({ stdTTL });
    }

    set (key, val, ttl) {
        return this.#cache.set(this.#appendKeyPrefix(key), val, ttl);
    }

    mset (values) {
        return this.#cache.mset(values.map(val => {
            return {
                key: this.#appendKeyPrefix(val.key),
                val: val.val
            };
        }));
    }

    get (key) {
        return this.#cache.get(this.#appendKeyPrefix(key));
    }

    has (key) {
        return this.#cache.has(this.#appendKeyPrefix(key));
    }

    take (key) {
        return this.#cache.take(this.#appendKeyPrefix(key));
    }

    mget (keys) {
        const mget = this.#cache.mget(keys.map(key => this.#appendKeyPrefix(key)));
        const result = {};
        for (const key of Object.keys(mget)) {
            result[this.#removeKeyPrefix(key)] = mget[key];
        }
        return result;
    }

    del (key) {
        return this.#cache.del(this.#appendKeyPrefix(key));
    }

    mdel (keys) {
        return this.#cache.del(keys.map(key => this.#appendKeyPrefix(key)));
    }

    ttl (key, seconds) {
        return this.#cache.ttl(this.#appendKeyPrefix(key), seconds);
    }

    getTtl (key) {
        return this.#cache.getTtl(this.#appendKeyPrefix(key));
    }

    keys () {
        const keys = this.#cache.keys();
        return keys.map(key => this.#removeKeyPrefix(key));
    }

    close () {
        this.#cache.close();
    }

    on (event, callback) {
        this.#cache.on(event, callback);
    }

    #appendKeyPrefix (key) {
        return `${this.#prefixKey}${key}`;
    }

    #removeKeyPrefix (key) {
        return key.replace(this.#prefixKey, '');
    }
}

module.exports = MemoryCache;

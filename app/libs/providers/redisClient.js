const Redis = require('ioredis');
const RedisStore = require('connect-redis').default;
const EventEmitter = require('events');

class RedisClient extends EventEmitter {
    #driver;
    #subscriber;
    #logger;
    redisStore;

    /**
     * @param {Object} options
     * @param {string} options.host Redis host
     * @param {number} options.port Redis port
     * @param {number} options.db   database Redis Database
     * @param {string} options.keyPrefix KEY的前缀词
     */
    constructor (options, logger) {
        super();

        // if (options.keyPrefix === '') {
        //     throw new Error('keyPrefix cannot be null or empty');
        // }
        // const keyPrefix = `platform:${options.keyPrefix}:`;
        this.#driver = new Redis({
            host: options.host,
            port: options.port,
            db: options.db,
            password: options.password,
            // keyPrefix: keyPrefix,
            connectTimeout: 10000,
            maxRetriesPerRequest: options.maxRetriesPerRequest ?? 3,
            lazyConnect: true
        });

        this.#subscriber = new Redis({
            host: options.host,
            port: options.port,
            db: options.db,
            password: options.password,
            connectTimeout: 10000,
            maxRetriesPerRequest: options.maxRetriesPerRequest ?? 3,
            lazyConnect: true
        });

        this.#logger = logger ?? console;

        this.redisStore = new RedisStore({
            client: this.#driver,
            prefix: 'session:'
        });

        this.#subscriber.on('connect', () => {
            this.#logger.log('Redis subscriber connected');
        });
    }

    /*
     * @method publish
     */
    async publish (channel, message) {
        try {
            await this.#driver.publish(channel, message);
        } catch (error) {
            this.#logger.error('Failed to publish message: %s', error.message);
        }
    }

    /*
     * @method subscribe
     */
    async subscribe (channel) {
        try {
            await this.#subscriber.subscribe(channel);
            this.#logger.log(`Subscribed successfully to ${channel}`);

            this.#subscriber.on('message', (channel, message) => {
                this.#logger.log(`Received message from ${channel}: ${message}`);
                this.emit('message', channel, message);
            });
        } catch (error) {
            this.#logger.error('Failed to subscribe: %s', error.message);
        }
    }

    /**
     * Strings set
     * @method set
     * @async
     * @param {string} key KEY
     * @param {string | number } value VALUE
     * @param {number} millisecond Time to live - millisecond
     * @returns {Promise<boolean>}
     * @example set('key1','value') | set('key1','value',10*1000) - live 10 seconds
     * */
    async set (key, value, millisecond = -1) {
        if (typeof value !== 'string' && typeof value !== 'number') {
            this.#logger.error('redis set failed: value type only can be string or number。');
            return false;
        }
        try {
            if (millisecond < -1) {
                return false;
            } else if (millisecond === 0) {
                return true;
            } else if (millisecond === -1) {
                await this.#driver.set(key, value);
                return true;
            } else {
                await this.#driver.set(key, value, 'PX', millisecond);
                return true;
            }
        } catch (error) {
            this.#logger.error(error);
            throw error;
        }
    }

    /**
     * Strings set
     * @method set
     * @async
     * @param {string} key KEY
     * @param {number | string } value VALUE
     * @param {number} millisecond Time to live - millisecond
     * @returns {Promise<boolean>}
     * @example set('key1','value') | set('key1','value',10*1000) - live 10 seconds
     * */
    async setNx (key, value, millisecond = -1) {
        if (typeof value !== 'string' && typeof value !== 'number') {
            this.#logger.error('redis set failed: value type only can be string or number。');
            return false;
        }
        try {
            let result = {};
            if (millisecond < -1) {
                return false;
            } else if (millisecond === -1) {
                result = await this.#driver.set(key, value, 'NX');
            } else {
                result = await this.#driver.set(key, value, 'PX', millisecond, 'NX');
            }
            return result === 'OK';
        } catch (error) {
            this.#logger.error(error);
            throw error;
        }
    }

    /**
     * Strings setEx
     * @method setEx
     * @async
     * @param {string} key KEY
     * @param {object} value VALUE
     * @param {number} second Time to live - second
     * @returns {Promise<boolean>}
     * @example set('key1','value') | set('key1', 'value', 10) - live 10 seconds
     * */
    async setEx (key, value, second = -1) {
        if (typeof value !== 'object') {
            this.#logger.error('redis set failed: value type only can be object。');
            return false;
        }
        try {
            let result = {};
            if ( second < -1 ) {
                return false;
            } else if ( second === -1 ) {
                result = await this.#driver.set(key, JSON.stringify(value));
            } else {
                result = await this.#driver.setex(key, second, JSON.stringify(value));
            }
            return result === 'OK';
        } catch (error) {
            this.#logger.error(error);
            throw error;
        }
    }

    /**
     * Strings get
     * @method get
     * @async
     * @param {string} key Key
     * @returns {Promise<string>}
     * @example get('key1')
     * */
    async get (key) {
        return await this.#driver.get(key);
    }

    /**
     * String multiple get
     * @method mGet
     * @param {string} keys  KEY的集合
     * @returns {Promise<Object>}
     * @example mGet('key1','key2')
     * */
    async mGet (...keys) {
        const mGetResult = await this.#driver.mget(...keys);
        const result = {};
        for (const idx in keys) {
            result[keys[idx]] = mGetResult[idx];
        }
        return result;
    }

    /**
     * Strings del
     * @method del
     * @param {string} keys KEY的集合
     * @returns {Promise<number>} 删除的笔数
     * @example del('key1','key2')
     * */
    async del (...keys) {
        return await this.#driver.del(keys);
    }

    /**
     * Strings exists
     * @method exists
     * @param {string} key KEY
     * @returns {Promise<number>} 存在 回传 1 / 不存在 回传 0
     * @example exists('key1')
     * */
    async exists (key) {
        return await this.#driver.exists(key);
    }

    // ##endregion

    // ##region TTL
    /**
     * 设定存活时间(TTL)
     * @method expire
     * @param {string} key KEY
     * @param {number} millisecond Time to live - millisecond
     * @returns {Promise<number>} 成功 回传 1 / 失败 回传 0
     * @example expire('key1',10*1000) 设定key1存活10秒
     * */
    async expire (key, millisecond) {
        return await this.#driver.pexpire(key, millisecond);
    }

    /**
     * 回传存活时间(TTL)
     * @method expire
     * @param {string} key KEY
     * @returns {Promise<number>} 回传该key剩余的存活时间(ttl) - millisecond
     * @example ttl('key1')
     * */
    async ttl (key) {
        return (await this.#driver.ttl(key)) * 1000;
    }

    // ##endregion

    /**
     * hashes set
     * @method hSet
     * @param {string} key KEY
     * @param {string} field Field
     * @param {string|number} value
     * @example hSet('key1','field',{}|'string'|1234)
     * */
    async hSet (key, field, value) {
        if (typeof value !== 'string' && typeof value !== 'number') {
            this.#logger.error('redis hSet failed: value type only can be string or number。');
            return false;
        }
        const obj = {};
        obj[field] = value;
        return await this.#driver.hset(key, obj);
    }

    /**
     * hashes get value by key and field
     * @method hGet
     * @param {string} key KEY
     * @param {string} field Field
     * @returns {Promise<string|object>} Hashes Value
     * @example hGet('key1','field')
     * */
    async hGet (key, field) {
        return await this.#driver.hget(key, field);
    }

    /**
     * hashes get all field and value by key
     * @method hGetAll
     * @param {string} key KEY
     * @returns {Promise<object>} {field1: valueOfField1, field2: valueOfField2}
     * @example hGetAll('key1')
     * */
    async hGetAll (key) {
        const data = await this.#driver.hgetall(key);
        if (Object.keys(data).length === 0) {
            return null;
        }
        return data;
    }

    /**
     * check the hashes value is exists by key and field
     * @method hExists
     * @param {string} key KEY
     * @param {string} field Field
     * @returns {Promise<boolean>} 存在 1 / 不存在 0
     * @example hExists('key1','field2')
     * */
    async hExists (key, field) {
        return await this.#driver.hexists(key, field);
    }

    /**
     * delete hashes by key and multiple fields
     * @method hDel
     * @param {string} key KEY
     * @params {[]string} fields
     * @returns {Promise<boolean>}
     * @example hDel('key1','field1','field2')
     * */
    async hDel (key, ...fields) {
        return await this.#driver.hdel(key, fields);
    }

    /**
     *
     * @param {string} key KEY
     * @param {number} start 返回有序集合的起点
     * @param {number} end   返回有序集合的终点
     * @returns {Promise<object>}
     * @example zRange('key1',1,2)
     * */
    async zRange (key, start, end) {
        return await this.#driver.zrange(key, start, end);
    }

    async keys (...keys) {
        return await this.#driver.keys(keys);
    }

    async ping () {
        return await this.#driver.ping();
    }

    connect () {

    }
}

module.exports = RedisClient;

const mysql = require('mysql2');

class MySqlPool {
    #keys;
    #oldKeys;
    #logger;

    constructor (logger) {
        const dbKey = {
            kydb: {},
            gameRecord: {},
            gameManage: {},
            gameApi: {},
            gameStatistics: {},
            kyStatis: {},
            financeManage: {},
            ordersRecord: {},
            wallet: {},
            sbo: {},
            remindData: {},
            jackpot: {},
            fb: {},
            kyOrder: {}
        };
        this.#keys = [];
        this.#oldKeys = [];
        this['obsolete'] = {};

        // test
        for (const key of Object.keys(dbKey)) {
            this['obsolete'][key] = Object[key];
            this[key] = Object[key];
        }
        this.#logger = logger ?? console;
    }

    add (setting) {
        if (!setting?.name) {
            throw new Error('cannot add sql by setting: name cannot be null or empty');
        }

        const lowerCaseName = setting.name.toLowerCase();
        const keyExists = this.#keys.findIndex(element => element.lowerCaseName === lowerCaseName);
        if (keyExists > -1) {
            throw new Error(`cannot add sql by setting: name [${setting.name}] is exists`);
        }

        this[setting.name] = new MySqlProvider(convertToMySqlConfig(setting.master), convertToMySqlConfig(setting.slave), this.#logger);
        this.#keys.push({ name: setting.name, lowerCaseName });
    }

    addOld (setting) {
        if (!setting?.name) {
            throw new Error('cannot add sql by setting: name cannot be null or empty');
        }

        const lowerCaseName = setting.name.toLowerCase();
        const keyExists = this.#oldKeys.findIndex(element => element.lowerCaseName === lowerCaseName);
        if (keyExists > -1) {
            throw new Error(`cannot add sql by setting: name [${setting.name}] is exists`);
        }

        this['obsolete'][setting.name] = new MySqlProviderForOld(convertToMySqlConfig(setting.master), convertToMySqlConfig(setting.slave), this.#logger);
        this.#oldKeys.push({ name: setting.name, lowerCaseName });
    }

    keys () {
        return this.#keys.map(element => element.name);
    }

    oldKeys () {
        return this.#oldKeys.map(element => element.name);
    }
}

class MySqlConfig {
    constructor (username, password, host, port, database, multipleStatements, waitForConnections, connectionLimit, queueLimit) {
        this.user = username;
        this.password = password;
        this.host = host;
        this.port = port;
        this.database = database;
        this.multipleStatements = multipleStatements ?? true;
        this.waitForConnections = waitForConnections ?? true;
        this.connectionLimit = connectionLimit ?? 10;
        this.queueLimit = queueLimit ?? 0;
        this.dateStrings = true;
        this.typeCast = (field, useDefaultTypeCasting) => {
            // // We only want to cast bit fields that have a single-bit in them. If the field
            // // has more than one bit, then we cannot assume it is supposed to be a Boolean.
            // if ((field.type === 'BIT') && (field.length === 1)) {
            //   const bytes = field.buffer()
            //
            //   // A Buffer in Node represents a collection of 8-bit unsigned integers.
            //   // Therefore, our single "bit field" comes back as the bits '0000 0001',
            //   // which is equivalent to the number 1.
            //   return (bytes[0] === 1)
            // }

            return (useDefaultTypeCasting());
        };
    }
}

class MySqlProvider {
    #logger;

    constructor (masterOpt, slaveOpt, logger) {
        if (!masterOpt) {
            throw new Error('master option cannot be null or empty');
        }
        this.master = mysql.createPool(masterOpt).promise();
        this.slave = !slaveOpt ? this.master : mysql.createPool(slaveOpt).promise();
        this.#logger = logger ?? console;
    }

    /**
     * @param {string} sql
     * @param {array} params
     * @param {object} options
     * @param {boolean} options.disableLogging if true, print sql
     * @returns {Promise<array>}
     */
    async query (sql, params, options = {}) {
        try {
            const { disableLogging = false } = options;
            const provider = sql.match(/^\s*select\s*/gi) !== null ? this.slave : this.master;
            sql = provider.format(sql, params);
            if (!disableLogging) {
                this.#logger.sql(sql);
            }
            return await provider.query(sql);
        } catch (error) {
            this.#logger.error(`SQL语句执行出错: ${error.sql} 。 MESSAGE: ${error.message}。STACK: ${error.stack}`);
            throw error;
        }
    }

    /*
     * Stored Procedure 用
     * 注意: Stored Procedure 的內容, 只能有 SELECT 操作
     */
    async slaveQuery (sql, params, options = {}) {
        try {
            const provider = this.slave;
            const { disableLogging = false } = options;

            const lowerSql = sql.toLowerCase();
            const keywords = ['insert', 'update', 'delete'];
            if ( keywords.some(keyword => lowerSql.includes(keyword)) ) {
                const errorMsg = `SQL執行方法錯誤, 無法使用 SLAVE, 包含: ${keywords.join(', ')}。sql: ${sql}`;
                this.#logger.warn(errorMsg);
                throw new Error(errorMsg);
            }

            const formattedSql = provider.format(sql, params);
            if ( !disableLogging ) {
                this.#logger.sql(formattedSql);
            }

            return await provider.query(formattedSql);
        } catch (error) {
            this.#logger.error(`SQL语句执行出错: ${error.sql || sql} 。 MESSAGE: ${error.message}。STACK: ${error.stack}`);
            throw error;
        }
    }

    async getMasterConnection () {
        return await this.master.getConnection();
    }

    async ping () {
        const connections = [await this.master.getConnection(), await this.slave.getConnection()];
        for (const conn of connections) {
            await conn.ping();
            await conn.release();
        }
    }
}

class MySqlProviderForOld {
    #logger;

    constructor (masterOpt, slaveOpt, logger) {
        if (!masterOpt) {
            throw new Error('master option cannot be null or empty');
        }
        this.master = mysql.createPool(masterOpt);
        this.slave = !slaveOpt ? this.master : mysql.createPool(slaveOpt);
        this.#logger = logger ?? console;
    }

    query (sql, params, cb) {
        const provider = sql.match(/^\s*select\s*/gi) !== null ? this.slave : this.master;
        const thiz = this;
        provider.query(sql, params, function (error, results, fields) {
            if (error) {
                thiz.#logger.error(`SQL语句执行出错: ${error.sql} 。 MESSAGE: ${error.message}。STACK: ${error.stack}`);
                cb(error);
            } else if (cb) {
                cb(error, results, fields);
            }
        });
    }

    queryAsync (sql, values) {
        const provider = sql.match(/^\s*select\s*/gi) !== null ? this.slave : this.master;
        const thiz = this;
        return new Promise((resolve, reject) => {
            provider.query(sql, values, function (error, results) {
                if (error) {
                    thiz.#logger.error(`SQL语句执行出错: ${error.sql} 。 MESSAGE: ${error.message}。STACK: ${error.stack}`);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

function convertToMySqlConfig (config) {
    return new MySqlConfig(config.user, config.password, config.host, config.port, config.database, config.multipleStatements, config.waitForConnections, config.connections, config.queueLimit);
}

module.exports.createPool = (logger) => new MySqlPool(logger);

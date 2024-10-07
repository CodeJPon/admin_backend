const path = require('path');
const globalConfig = require('../../../../configs/envConfig');

const config = {
    repositories: {
        mysql: [
            {
                name: 'kydb',
                master: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'KYDB_NEW',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                },
                slave: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'KYDB_NEW',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                }
            },
            {
                name: 'gameRecord',
                master: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'game_record',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                },
                slave: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'game_record',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                }
            },
            {
                name: 'gameManage',
                master: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'game_manage',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                },
                slave: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'game_manage',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                }
            },
            {
                name: 'gameApi',
                master: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'game_api',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                },
                slave: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'game_api',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                }
            },
            {
                name: 'gameStatistics',
                master: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'game_statistics',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                },
                slave: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'game_statistics',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                }
            },
            {
                name: 'kyStatis',
                master: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'KYStatis',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                },
                slave: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'KYStatis',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                }
            },
            {
                name: 'kyStatisLogin',
                master: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'KYStatisLogin',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                },
                slave: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'KYStatisLogin',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                }
            },
            {
                name: 'financeManage',
                master: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'finance_manage',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                },
                slave: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'finance_manage',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                }
            },
            {
                name: 'ordersRecord',
                master: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'orders_record',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                },
                slave: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'orders_record',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                }
            },
            {
                name: 'wallet',
                master: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'wallet',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                },
                slave: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'wallet',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                }
            },
            {
                name: 'sbo',
                master: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'orders_record',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                },
                slave: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'orders_record',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                }
            },
            {
                name: 'remindData',
                master: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'remind_data',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                },
                slave: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'remind_data',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                }
            },
            {
                name: 'jackpot',
                master: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'jackpot',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                },
                slave: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'jackpot',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                }
            },
            {
                name: 'fb',
                master: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'fb',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                },
                slave: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'fb',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                }
            },
            {
                name: 'kyOrder',
                master: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'KYOrder',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                },
                slave: {
                    user: globalConfig.mysql.default.master.user,
                    password: globalConfig.mysql.default.master.password,
                    host: globalConfig.mysql.default.master.host,
                    port: +globalConfig.mysql.default.master.port,
                    database: 'KYOrder',
                    connectionLimit: 10,
                    multipleStatements: true,
                    waitForConnections: true,
                    queueLimit: 0
                }
            },

        ],
        redis: [
            {
                name: 'default',
                host: globalConfig.redis.default.host,
                port: globalConfig.redis.default.port,
                database: globalConfig.redis.default.database,
                password: globalConfig.redis.default.password,
                prefixKey: 'default'
            },
        ]
    }
};

module.exports = config;

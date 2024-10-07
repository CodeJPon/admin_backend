const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
module.exports = Object.freeze({
  env: process.env.ENV,
  platform: {
    hotReload: {
        gameServer: {
            chDataPath: process.env.PLATFORM_GAMESERVER_HOT_UPDATE_CHDATA_PATH
        }
    },
    pzUid: process.env.PLATFORM_PZUID,
    agentType: process.env.PLATFORM_AGENT_TYPE,
    name: process.env.PLATFORM,
    port: +process.env.PLATFORM_PORT,
    secret: process.env.PLATFORM_SECRET,
    whiteIp: process.env.PLATFORM_WHITE_IP,
    aesKey: process.env.PLATFORM_DATADIG_AES_KEY,
    checkRPApi: process.env.CHECK_RP_API_LIST?.toLowerCase() === 'true',
    cwAccount: process.env.PLATFORM_CW_ACCOUNT ?? '',
    newAgentExternalGameControl: process.env.PLATFORM_NEW_AGENT_EXTERNAL_GAME_CONTROL,
    gameSubTag: process.env.PLATFORM_GAME_SUB_TAG,
    updateServer: {
        serverA: process.env.PLATFORM_UPDATE_SERVER_A_SERVER,
        serverB: process.env.PLATFORM_UPDATE_SERVER_B_SERVER,
        web: process.env.PLATFORM_UPDATE_SERVER_WEB
    },
    winLoseReport: {
        restrict: (function () {
            try {
                if (['dev', 'sit', 'qa'].includes(process.env.ENV)) {
                    return !(process.env.PLATFORM_WINLOSEREPORT_RESTRICT === 'false');
                }
            } catch (error) {
                logger.error(error);
            }
            return true;
        })(),
    },
    mToScoreRate: (function () {
        try {
            const envData = process.env.PLATFORM_M_TO_SCORE_RATE;
            if (!envData || envData === '' || isNaN(+envData)) {
                return 100;
            }
            return +envData;
        } catch (error) {
            return 100;
        }
    })(),
    locales: (function () {
        try {
            const envData = process.env.LOCALES;
            if (!envData) {
                return ['cn', 'en'];
            }
            return envData.split(',');
        } catch (error) {
            logger.error(error);
            return ['cn', 'en'];
        }
    })()
  },
  gameHandle: process.env.GAME_API_GAMEHANDLE_HOST,
  mysql: {
    default: {
        master: {
            host: process.env.DEFAULT_DB_MASTER_HOST,
            port: process.env.DEFAULT_DB_MASTER_PORT,
            user: process.env.DEFAULT_DB_MASTER_USER,
            password: process.env.DEFAULT_DB_MASTER_PASSWORD
        }, slave: {
            host: process.env.DEFAULT_DB_MASTER_HOST,
            port: process.env.DEFAULT_DB_MASTER_PORT,
            user: process.env.DEFAULT_DB_MASTER_USER,
            password: process.env.DEFAULT_DB_MASTER_PASSWORD
        }
    },
  },
  redis: {
    default: {
        host: process.env.REDIS_DEFAULT_HOST,
        port: process.env.REDIS_DEFAULT_PORT,
        database: process.env.REDIS_DEFAULT_DATABASE,
        password: process.env.REDIS_DEFAULT_PASSWORD
    }
  },
});
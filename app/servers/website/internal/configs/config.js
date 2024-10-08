const envConfig = require('../../../../configs/envConfig');

module.exports = {
    env: envConfig.env,
    platform: {
        port: envConfig.platform.port,
        secret: envConfig.platform.secret,
        checkRPApi: envConfig.platform.checkRPApi,
        hotUpdate: {
            gameServer: {
                chDataPath: envConfig.platform.hotReload.gameServer.chDataPath
            }
        }
    },
    gameApiServer: {
        api: {
            url: envConfig.gameApi.apiUrl
        }
    },
    // interdepartmentalServer: {
    //     api: {
    //         url: `${envConfig.interdepartmental.host}:${envConfig.interdepartmental.port}`
    //     }
    // },
    // logo: {
    //     fileUploadURL: envConfig.logo.fileUploadURL,
    //     fileUploadPath: envConfig.logo.fileUploadPath,
    //     logoServer: envConfig.logo.logoServer
    // },
    // delivery: {
    //     all: {
    //         defaultMoney: envConfig.delivery.all.defaultMoney,
    //         defaultMoneyNotProcesse: envConfig.delivery.all.defaultMoneyNotProcesse,
    //     },
    //     platform: {
    //         defaultMoney: envConfig.delivery.platform.defaultMoney,
    //         defaultMoneyNotProcesse: envConfig.delivery.platform.defaultMoneyNotProcesse,
    //     },
    //     sport: {
    //         defaultMoney: envConfig.delivery.sport.defaultMoney,
    //         defaultMoneyNotProcesse: envConfig.delivery.sport.defaultMoneyNotProcesse,
    //     }
    // },
    // verify2FaStatus: envConfig.verify2FaStatus,
    // oldServer: envConfig.oldServer,
    // AutoCloseUserAccountsStatusDate: envConfig.AutoCloseUserAccountsStatusDate,
    // isEnableCheckIP: envConfig.isEnableCheckIP,
    // telegram: {
    //     botToken: envConfig.botToken,
    //     chatId: envConfig.chatId
    // }
};

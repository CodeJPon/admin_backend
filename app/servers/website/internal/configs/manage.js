const envConfig = require('../../../../configs/envConfig');

// 玩家输赢监控返回数据条数
module.exports.rankLength = 50;
// 代理默认whiteip
module.exports.whiteipwebconfig = envConfig.platform.whiteIp;
//更新并重启C端
// module.exports.updateAndRestartCServer = "http://192.168.33.10:3000/updateAndRestartCServer";
// 系统标识
module.exports.agentType = envConfig.platform.agentType;
// 占成不需要做限制的代理账号
module.exports.proxyname = 'test0608';
module.exports.dataDigAESKEY = envConfig.platform.aesKey;// 后台同桌玩家链接加密解密key
// 代理商后台 下级代理占成不能低于占成的限制
module.exports.ZCrestrict = 8;
// 开发商后台代理游戏管理设置状态时需判断是否是一级代理也就是UID为0的的代理，特殊情况时配置成特定的代理id
module.exports.pzUID = envConfig.platform.pzUid;
// 杀数配置
module.exports.killRate = 0.028;
// 财务管理指定账号，格式：admin1,admin2
module.exports.cw_accounts = envConfig.platform.cwAccount;
// 平台标识
module.exports.platform = envConfig.platform.name;
// 單一錢包URL
module.exports.Transfer_Engaged = '0';
module.exports.loginAesKey = 'fd295FAGApiuDGLQ';
module.exports.sessionSecret = 'hello world';
//module.exports.sboDomain = 'http://192.168.33.10:79/sboHandle';
module.exports.gameHandleUrl = envConfig.gameHandle
// 代理商后台输赢报表庄闲根据指定代理ID是否显示
module.exports.specialAgent =[72847,70254,70253,70246,70251];
//限制输赢报表是否能十分钟以外搜索
module.exports.restrict = envConfig.platform.winLoseReport.restrict;
//限制游戏状态设置是否能高频请求
module.exports.gameStatusUpdateRestrict = true;
// 平台子标签名称
module.exports.platformGameSubTag = envConfig.platform.gameSubTag;

/**
 * 金额转换成分数的倍率
 * @type {number}
 * */
module.exports.mToScoreRate = +envConfig.platform.mToScoreRate;

module.exports.newAgentExternalGameControl = +envConfig.platform.newAgentExternalGameControl;


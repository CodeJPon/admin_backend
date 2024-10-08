require('./internal/libs/utils/string');
const Host = require('../../libs/host');
const morgan = require('./internal/middlewares/morgan');
const git = require('git-rev-sync');
const xssProtect = require('./internal/middlewares/xssProtect/xssProtect');
const expressSession = require('express-session');
const { v4: uuidv4 } = require('uuid');
const createNamespace = require('continuation-local-storage').createNamespace;
require('./internal/libs/numberExtension');
require('../../libs/num');
require('../../libs/stringExtension');
const pathHelper = require('path');
const fs = require('fs');
const host = new Host('website');
global.logger = host.logger;
const namespace = createNamespace('dashboard.platform');
host.configuration(configuration)
.addService(addNodeCache)
.addService(addMySql)

console.log('host', host.services.mysqlPool)
// 取設定檔
function configuration (configs) {
  const folder = pathHelper.join(__dirname, 'internal', 'configs');
  fs.readdirSync(folder, { withFileTypes: true }).forEach(file => {
      const fName = file.name.substring(0, file.name.lastIndexOf('.'));      
      configs[fName] = require(pathHelper.join(folder, fName));
  });
}
// 建立记忆体快取服务
function addNodeCache (services) {
  const NodeCache = require('../../libs/providers/nodeCache');
  services.nodeCache = new NodeCache('platform', 60 * 60);
}
// 建立MySql服务
function addMySql (services) {
  const mysqlPool = require('../../libs/providers/mysqlPool');
  if (!services.configs?.db?.repositories?.mysql) {
      return;
  }
  for (const setting of services.configs.db.repositories.mysql) {
      if (!services.mysqlPool) services.mysqlPool = mysqlPool.createPool(host.logger);
      services.mysqlPool.add(setting);
      services.mysqlPool.addOld(setting); // obsolete
  }  
}
// 建立Redis服务
async function addRedis (services) {
  // redis
  const Redis = require('../../libs/providers/redisClient', host.logger);

  if (!services.configs.db?.repositories?.redis) {
      return;
  }
  for (const setting of services.configs.db.repositories.redis) {
      const option = {
          host: setting.host,
          port: +setting.port,
          db: +setting.database,
          keyPrefix: setting.prefixKey,
          password: setting.password
      };
      try {
          if (!services.redis) services.redis = {};
          services.redis[setting.name] = new Redis(option);
          await services.redis[setting.name].ping();
          await services.redis[setting.name].connect();
      } catch (error) {
          host.logger.error(`Redis client ${setting.name} connect failed: ${error.message} 。 connection: ${JSON.stringify(option)}`);
          process.exit();
      }
  }
}
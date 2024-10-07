const loggerBuilder = require('./logger');
require('express-async-errors');

const Host = function (serviceName) {
  this.name = serviceName;
  // todo get set
  this.app = {};
  // todo get set
  this.services = {
      configs: {}
  };
  // todo get set
  this.routes = [];
  try {
      this.logger = loggerBuilder.createLogger(serviceName);
  } catch (error) {
      this.logger = console;
  }
};

Host.prototype.configuration = function (cb) {
  cb(this.services.configs);
  return this;
};

Host.prototype.addService = function (cb) {
  cb(this.services);
  // this.services[serviceName] = driver
  return this;
};

Host.prototype.addRoutes = function (cb) {
  const routes = cb();
  for (const route of routes) {
      this.routes = this.routes.filter(ele => ele.target !== route.target);
      const existRoute = this.routes.find(ele => ele.group === route.group);
      if (existRoute) {
          existRoute.target = route.target;
      } else {
          this.routes.push(route);
      }
  }
  return this;
};

Host.prototype.set = function (key, value) {
  if (Object.keys(this).indexOf(key) < 0) {
      this[key] = value;
  }
  return this;
};

Host.prototype.build = function (cb) {
  cb(this);
  return this;
};

Host.prototype.start = function () {
  if (this.routes.length > 0) {
      for (const route of this.routes) {
          try {
              this.app.use(route.group, require(route.target));
          } catch (error) {
              this.logger.error(`Router use failed。 group: ${route.group} 。 file: ${route.target} 。 error: ${error.message}`);
          }
      }
  }
  this.app.use((req, res) => {
      const err = new Error('Not Found');
      err.status = 404;
      res.status(404).json(404);
      // next(err)
  });
  const thiz = this;

  const errorHandle = require('./middlewares/errorHandle');
  this.app.use(errorHandle.create(thiz.logger ?? console));

  if (!thiz.port || thiz.port <= 0 || isNaN(thiz.port)) {
      throw new Error(`port cannot be null or empty: ${thiz.port}`);
  }

  this.app.listen(thiz.port, function () {
      thiz.logger.info(`${thiz.name} http 服务器启动成功,端口号: ${thiz.port}`);
  });
};

module.exports = Host;
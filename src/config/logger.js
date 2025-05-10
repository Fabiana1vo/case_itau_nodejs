const { format } = require('path')
var winston = require('winston')


const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.printf((options) => {
          const { moduleName, level, message, ...meta} = options
            let log = `[${moduleName}] ${level} : ${message}`;

                  
          if (meta.stack) {
            log += `\n→ Stack:\n${meta.stack}`;
            delete meta.stack;
          }

          const metaKeys = Object.keys(meta);
          if (metaKeys.length) {
            log += `\n→ Meta:`;
            metaKeys.forEach(key => {
              log += `\n   ${key}: ${meta[key]}`;
            });
          }

          return log;
        })
      ),
    }),
    new winston.transports.File({
      filename: "combined.log",
      level: "info",
    }),
  ],
});
 

module.exports = function (name) {
  return logger.child({ moduleName: name });
};

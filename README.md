# log4js-logstash-kafka
A simple log appender for log4js that sends the data to logstash by kafka.

Installation
------------
```
npm install log4js-logstash-kafka --save
```

Usage: logstash configuration
-----------------------------
In the "input" part of the logstash server conf :
```
input {
  kafka {
    topic_id => "YOURTOPIC"
    codec => json
  }
}
```

Usage: log4js configuration
---------------------------
Plain javascript
```javascript
  const log4js = require('log4js');
  log4js.configure({
      appenders: [{
          type: "log4js-logstash-kafka",
          topic: "YOURTOPIC"
      }]
  });

  const logger = log4js.getLogger();

  logger.debug('hello');
```

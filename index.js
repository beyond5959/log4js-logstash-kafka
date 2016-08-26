"use strict";
const util = require('util');
const layouts = require('log4js').layouts;
const Kafka = require('no-kafka');
const producer = new Kafka.Producer();

function logstashKafka(config, layout) {
  let type = config.logType ? config.logType : config.category;
  layout = layout || layouts.dummyLayout;
  if(!config.fields) {
    config.fields = {};
  }

  return function log(loggingEvent) {
    if (loggingEvent.data.length > 1) {
      let secondEvData = loggingEvent.data[1];
      for (let k in secondEvData) {
        config.fields[k] = secondEvData[k];
      }
    }
    config.fields.level = loggingEvent.level.levelStr;

    let logObject = {
      "@version" : "1",
      "@timestamp" : (new Date(loggingEvent.startTime)).toISOString(),
      "type" : config.logType ? config.logType : config.category,
      "message" : layout(loggingEvent),
      "fields" : JSON.stringify(config.fields)
    };
    sendLog(config.topic, logObject);
  };
}

function sendLog(topic, logObject) {
  let logString = JSON.stringify(logObject);

  producer.init().then(function(){
    return producer.send({
        topic: 'test',
        partition: 0,
        message: {
            value: logString
        }
    });
  })
  .then(function (result) {
    // console.log('result:', result);
  })
  .catch(function (err) {
    console.log("log4js-logstash-kafka - Error: %s", util.inspect(err))
  });
}

function configure(config) {
  let layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return logstashKafka(config, layout);
}

exports.appender = logstashKafka;
exports.configure = configure;

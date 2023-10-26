const Eureka = require("eureka-js-client").Eureka;

function registerWithEureka() {

  const eureka = new Eureka({
    instance: {
      app: "nodemicroservice",
      hostName: "localhost",
      ipAddr: "127.0.0.1",
      port: {
        $: 3005,
        "@enabled": true,
      },
      vipAddress: "nodemicroservice",
      dataCenterInfo: {
        "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
        name: "MyOwn",
      },
    },
    eureka: {
      eureka: {
        host: "discovery",
        port: 8761,
        servicePath: "/eureka/apps/",
        maxRetries: 10,
        requestRetryDelay: 2000,
      },
    },
  });

  eureka.logger.level("debug");

  eureka.start((error) => {
    console.log(error || "user service registered");
  });

  function exitHandler(options, exitCode) {
    if (options.cleanup) {
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) {
      eureka.stop();
    }
  }

  eureka.on("deregistered", () => {
    process.exit();
    console.log("after deregistered");
  });

  eureka.on("started", () => {
    console.log("eureka host  " + eurekaHost);
  });

  process.on("SIGINT", exitHandler.bind(null, { exit: true }));
}

module.exports = { registerWithEureka };

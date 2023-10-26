const Eureka = require("eureka-js-client").Eureka;

function registerWithEureka() {

  const eureka = new Eureka({
    instance: {
      app: "nodemicroservice",
      hostName: "nodemicroservice",
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
      serviceUrls: {
        default: ["http://discovery:8761/eureka/"],
      },
    },
  });

  eureka.logger.level("debug");

  // Start the Eureka client registration
  eureka.start();

  // Handle any cleanup on process exit
  process.on("SIGINT", () => {
    eureka.stop(() => process.exit());
  });
}

module.exports = { registerWithEureka };

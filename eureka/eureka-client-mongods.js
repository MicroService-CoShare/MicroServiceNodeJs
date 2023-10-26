const Eureka = require("eureka-js-client").Eureka;

function registerMongoDBWithEureka() {
  const eureka = new Eureka({
    instance: {
      app: "microservice", // Change the app name to reflect your MongoDB service
      instanceId: "mongodb-instance",
      hostName: "mongo", // Use the Docker container name
      ipAddr: "127.0.0.1",
      port: {
        $: 27017,
        "@enabled": true,
      },
      vipAddress: "microservice", // Use the same service name as in your MONGODB_URI
      dataCenterInfo: {
        "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
        name: "MyOwn",
      },
    },
    eureka: {
      serviceUrls: {
        default: ["http://discovery:8761/eureka/"], // Eureka Server URL
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

module.exports = { registerMongoDBWithEureka };

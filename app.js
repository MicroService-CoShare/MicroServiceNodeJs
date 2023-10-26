const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const reviewRouter = require("./routes/review");
const requestRouter = require("./routes/request");
const { registerWithEureka } = require('./eureka/eureka-client');
const keycloak = require("./keycloak/keycloak-config");

require("dotenv").config();

// Create an instance of the Express.js application
const app = express();
app.use(cors());

// Initialize Keycloak middleware
app.use(keycloak.middleware());

// Connect to MongoDB
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error.message);
  });

app.use(express.json());

// Routes
app.use("/review", reviewRouter);
app.use("/request", requestRouter);

const port = process.env.PORT || 3006;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Register with Eureka
// registerWithEureka();

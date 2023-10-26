const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const reviewRouter = require("./routes/review");
const requestRouter = require("./routes/request");
const Keycloak = require("keycloak-connect");
const { registerWithEureka } = require("./eureka/eureka-client");

require("dotenv").config();

// Create an instance of the Express.js application
const app = express();
app.use(cors());

const keycloak = new Keycloak({
  "realm": process.env.KEYCLOAK_REALM,
  "auth-server-url": process.env.KEYCLOAK_AUTH_SERVER_URL,
  "bearer-only": true,
  "resource": process.env.KEYCLOAK_CLIENT_ID,
});

app.use(keycloak.middleware());

// Connect to MongoDB
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error.message);
  });

app.use(express.json());

// Routes
app.use("/review", reviewRouter);
app.use("/request", requestRouter);

// Login route
app.get("/login", keycloak.protect(), (req, res) => {
  res.send("Successfully authenticated!");
});

// Logout route
app.get("/logout", (req, res) => {
  req.kauth.grant.access_token = null;
  req.kauth.grant.refresh_token = null;
  req.logout();
  res.send("Logged out successfully.");
});

const port = process.env.PORT || 3006;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Register with Eureka
// registerWithEureka();

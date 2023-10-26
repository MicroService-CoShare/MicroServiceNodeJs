const Request = require("../model/request");
const express = require("express");
const router = express.Router();
const Keycloak = require("keycloak-connect");

require("dotenv").config();

const keycloak = new Keycloak(
  {
    realm: process.env.KEYCLOAK_REALM,
    "auth-server-url": process.env.KEYCLOAK_AUTH_SERVER_URL,
    "bearer-only": true,
    resource: process.env.KEYCLOAK_CLIENT_ID,
  }
);

const requestRouter = (app) => {
  // GET requests (secured with Keycloak)
  router.get("/getRequests", keycloak.protect(), async (req, res) => {
    try {
      const requests = await Request.find();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add a request
  router.post("/addRequest", keycloak.protect(), async (req, res) => {
    const request = new Request({
      status: req.body.status,
    });

    try {
      const newRequest = await request.save();
      res.status(201).json(newRequest);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update a request
  router.put("/updateRequest/:id", keycloak.protect(), async (req, res) => {
    const { id } = req.params;
    try {
      const updatedRequest = await Request.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedRequest) {
        return res.status(404).json({
          message: "Request not found",
        });
      }
      res.json(updatedRequest);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete a request
  router.delete("/deleteRequest/:id", keycloak.protect(), async (req, res) => {
    const { id } = req.params;
    try {
      const removedRequest = await Request.findByIdAndDelete(id);
      if (!removedRequest) {
        return res.status(404).json({
          message: "Request not found",
        });
      }
      res.json(removedRequest);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get a request by ID
  router.get("/getRequest/:id", keycloak.protect(), (req, res) => {
    const { id } = req.params;
    Request.findById(id)
      .then((request) => {
        if (!request) {
          return res.status(404).json({
            message: "Request not found",
          });
        }
        res.json(request);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  });

  return router;
};

module.exports = requestRouter;

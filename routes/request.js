const Request = require("../model/request");
const express = require("express");
const router = express.Router();

require("dotenv").config();


const requestRouter = (app) => {
  // GET requests 
  router.get("/getRequests", async (req, res) => {
    try {
      const requests = await Request.find();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add a request
  router.post("/addRequest", async (req, res) => {
    console.log('addRequest')
    console.log(req.body)
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
  router.put("/updateRequest/:id",  async (req, res) => {
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
  router.delete("/deleteRequest/:id",  async (req, res) => {
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
  router.get("/getRequest/:id",  (req, res) => {
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

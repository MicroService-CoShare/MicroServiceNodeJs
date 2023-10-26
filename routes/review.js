const Review = require("../model/review");
const express = require("express");
const router = express.Router();
const Keycloak = require("keycloak-connect"); 

const keycloak = new Keycloak(
  {
    "realm": process.env.KEYCLOAK_REALM,
    "auth-server-url": process.env.KEYCLOAK_AUTH_SERVER_URL,
    "bearer-only": true,
    "resource": process.env.KEYCLOAK_CLIENT_ID,
  }
);

const reviewRouter = (app) => {
  // GET reviews (secured with Keycloak)
  router.get("/getReviews", keycloak.protect(), async (req, res) => {
    try {
      const reviews = await Review.find();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add a review (secured with Keycloak)
  router.post("/addReview", keycloak.protect(), async (req, res) => {
    const review = new Review({
      rating: req.body.rating,
      feedback: req.body.feedback,
    });

    try {
      const newReview = await review.save();
      res.status(201).json(newReview);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update a review (secured with Keycloak)
  router.put("/updateReview/:id", keycloak.protect(), async (req, res) => {
    const { id } = req.params;
    try {
      const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedReview) {
        return res.status(404).json({
          message: "Review not found",
        });
      }
      res.json(updatedReview);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete a review (secured with Keycloak)
  router.delete("/deleteReview/:id", keycloak.protect(), async (req, res) => {
    const { id } = req.params;
    try {
      const removedReview = await Review.findByIdAndDelete(id);
      if (!removedReview) {
        return res.status(404).json({
          message: "Review not found",
        });
      }
      res.json(removedReview);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get a review by ID (secured with Keycloak)
  router.get("/getReview/:id", keycloak.protect(), (req, res) => {
    const { id } = req.params;
    Review.findById(id)
      .then((review) => {
        if (!review) {
          return res.status(404).json({
            message: "Review not found",
          });
        }
        res.json(review);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  });

  return router;
};

module.exports = reviewRouter;

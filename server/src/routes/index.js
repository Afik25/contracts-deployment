const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/verifyJWT");
const countries = require("../middlewares/countries.json");
const Inscription = require("../api/v1/controllers/Inscription");
const Login = require("../api/v1/controllers/Login");
const User = require("../api/v1/controllers/User");
const Document = require("../api/v1/controllers/Document");
const Contract = require("../api/v1/controllers/Contract");
const Signer = require("../api/v1/controllers/Signer");
require("dotenv").config("../.env");
//
// root configure
router.get("/root", Inscription.rootConfigure);
router.get("/c", function (req, res) {
  res.status(200).json({
    "process.env.APP_ENV": process.env.APP_ENV,
    "process.env.DEV_DB_HOST": process.env.DEV_DB_HOST,
    "process.env.DEV_DB_DATABASE_NAME": process.env.DEV_DB_DATABASE_NAME,
  });
});
router.get("/test", function (req, res) {
  res.status(200).json({
    "process.env.APP_ENV": "test",
  });
});
//
router.get("/countries", function (req, res) {
  res.status(200).json({ countries });
});
//
// Register
router.post("/register", Inscription.create);
router.post("/complete", verifyJWT, Inscription.complete);
router.post("/activation", verifyJWT, Inscription.activateCompletion);
router.get("/dashboard", Inscription.dashboard);
//
// login
//
router.post("/login", Login.login);
router.get("/refresh", Login.refreshToken);
router.get("/logout", verifyJWT, Login.logout);
//
// User
router.post("/user", User.create).get("/user", User.get);
router
  .get("/user/key/:key", User.getByKey)
  .put("/user/key/:id", User.update)
  .delete("/user/key/:id", User.delete);
//
// Document
router
  .post("/document", Document.upload, Document.create)
  .get("/document", Document.get);
//
//
// Contract
router
  .post("/contract", Contract.upload, Contract.create)
  .get("/contract", Contract.get);
//
// Signer
router.post("/signer", Signer.create).get("/signer", Signer.get);
//

module.exports = router;

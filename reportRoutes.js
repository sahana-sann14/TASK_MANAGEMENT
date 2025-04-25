const express = require("express");
const router = express.Router();
const { getProgressReport } = require("../controllers/reportController");

router.get("/progress", getProgressReport);

module.exports = router;

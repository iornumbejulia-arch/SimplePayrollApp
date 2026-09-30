const express = require("express");

const {
    runPayroll,
    getPayrolls
} = require("../controllers/payrollController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/run", protect, authorize("admin"), runPayroll);
router.get("/", protect, getPayrolls);

module.exports = router;
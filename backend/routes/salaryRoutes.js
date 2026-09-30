const express = require("express");

const {
    createSalary,
    getSalaries,
    updateSalary,
    deleteSalary
} = require("../controllers/salaryController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("admin"), createSalary);

router.get("/", protect, getSalaries);

router.put("/:id", protect, authorize("admin"), updateSalary);

router.delete("/:id", protect, authorize("admin"), deleteSalary);

module.exports = router;
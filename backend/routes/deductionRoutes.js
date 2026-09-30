const express = require("express");

const {
    createDeduction,
    getDeductions,
    updateDeduction,
    deleteDeduction
} = require("../controllers/deductionController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("admin"),
    createDeduction
);

router.get(
    "/",
    protect,
    getDeductions
);

router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateDeduction
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteDeduction
);

module.exports = router;
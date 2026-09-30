const express = require("express");

const {
    createEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("admin"),
    createEmployee
);

router.get(
    "/",
    protect,
    getEmployees
);

router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateEmployee
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteEmployee
);

module.exports = router;
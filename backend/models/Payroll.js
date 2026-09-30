const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },

        basicSalary: {
            type: Number,
            required: true
        },

        allowances: {
            type: Number,
            default: 0
        },

        grossSalary: {
            type: Number,
            required: true
        },

        totalDeductions: {
            type: Number,
            default: 0
        },

        netSalary: {
            type: Number,
            required: true
        },

        payPeriod: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["processed", "pending"],
            default: "processed"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Payroll", payrollSchema);
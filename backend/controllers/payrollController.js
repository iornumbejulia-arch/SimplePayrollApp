const Employee = require("../models/Employee");
const Salary = require("../models/Salary");
const Deduction = require("../models/Deduction");
const Payroll = require("../models/Payroll");

const runPayroll = async (req, res) => {
    try {
        const { employeeId, payPeriod } = req.body;

        if (!employeeId || !payPeriod) {
            return res.status(400).json({
                success: false,
                message: "Employee ID and pay period are required",
                data: null
            });
        }

        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
                data: null
            });
        }

        const salary = await Salary.findOne({
            employee: employeeId
        }).sort({ effectiveDate: -1 });

        if (!salary) {
            return res.status(404).json({
                success: false,
                message: "Salary record not found",
                data: null
            });
        }

        const deductions = await Deduction.find({
            employee: employeeId
        });

        const totalDeductions = deductions.reduce(
            (total, deduction) => total + deduction.amount,
            0
        );

        const grossSalary =
            salary.basicSalary + salary.allowances;

        const netSalary =
            grossSalary - totalDeductions;

        const payroll = await Payroll.create({
            employee: employeeId,
            basicSalary: salary.basicSalary,
            allowances: salary.allowances,
            grossSalary,
            totalDeductions,
            netSalary,
            payPeriod,
            status: "processed"
        });

        res.status(201).json({
            success: true,
            message: "Payroll processed successfully",
            data: payroll
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to process payroll",
            data: null
        });
    }
};

const getPayrolls = async (req, res) => {
    try {
        const payrolls = await Payroll.find()
            .populate("employee", "name email department position")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            message: "Payroll records retrieved successfully",
            data: payrolls
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to retrieve payroll records",
            data: null
        });
    }
};

module.exports = {
    runPayroll,
    getPayrolls
};
const Employee = require("../models/Employee");

// Create employee
const createEmployee = async (req, res) => {
    try {
        const { name, email, department, position, salary } = req.body;

        if (!name || !email || !department || !position || salary === undefined) {
            return res.status(400).json({
                success: false,
                message: "All employee fields are required",
                data: null
            });
        }

        if (Number(salary) < 0) {
            return res.status(400).json({
                success: false,
                message: "Salary cannot be negative",
                data: null
            });
        }

        const existingEmployee = await Employee.findOne({ email });

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: "Employee already exists",
                data: null
            });
        }

        const employee = await Employee.create({
            name,
            email,
            department,
            position,
            salary
        });

        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: employee
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to create employee",
            data: null
        });
    }
};

// Get all employees
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();

        res.json({
            success: true,
            message: "Employees retrieved successfully",
            data: employees
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to retrieve employees",
            data: null
        });
    }
};

// Update employee
const updateEmployee = async (req, res) => {
    try {
        const { name, email, department, position, salary } = req.body;

        if (!name || !email || !department || !position || salary === undefined) {
            return res.status(400).json({
                success: false,
                message: "All employee fields are required",
                data: null
            });
        }

        if (Number(salary) < 0) {
            return res.status(400).json({
                success: false,
                message: "Salary cannot be negative",
                data: null
            });
        }

        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
                data: null
            });
        }

        employee.name = name;
        employee.email = email;
        employee.department = department;
        employee.position = position;
        employee.salary = salary;

        await employee.save();

        res.json({
            success: true,
            message: "Employee updated successfully",
            data: employee
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to update employee",
            data: null
        });
    }
};

// Delete employee
const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
                data: null
            });
        }

        await Employee.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Employee deleted successfully",
            data: null
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to delete employee",
            data: null
        });
    }
};

module.exports = {
    createEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee
};
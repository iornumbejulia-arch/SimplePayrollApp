import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [activePage, setActivePage] = useState("Dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [payrolls, setPayrolls] = useState([]);

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingSalary, setEditingSalary] = useState(null);
  const [editingDeduction, setEditingDeduction] = useState(null);

  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    salary: ""
  });

  const [salaryForm, setSalaryForm] = useState({
    employee: "",
    basicSalary: "",
    allowances: "",
    effectiveDate: ""
  });

  const [deductionForm, setDeductionForm] = useState({
    employee: "",
    type: "",
    amount: "",
    description: ""
  });

  const [payrollForm, setPayrollForm] = useState({
    employeeId: "",
    payPeriod: "September 2026"
  });

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const formatMoney = (amount) => {
    return `₦${Number(amount || 0).toLocaleString()}`;
  };

  // =========================
  // LOGIN
  // =========================

  const login = async (e) => {
    e.preventDefault();

    setLoginError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      localStorage.setItem("token", response.data.data.token);

      setLoggedIn(true);
    } catch (error) {
      setLoginError(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setActivePage("Dashboard");
  };

  // =========================
  // EMPLOYEES
  // =========================

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/employees`,
        authConfig
      );

      setEmployees(response.data.data || []);
    } catch (error) {
      console.error("Employees error:", error);
    }
  };

  const addEmployee = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/employees`,
        {
          name: employeeForm.name,
          email: employeeForm.email,
          department: employeeForm.department,
          position: employeeForm.position,
          salary: Number(employeeForm.salary)
        },
        authConfig
      );

      setEmployeeForm({
        name: "",
        email: "",
        department: "",
        position: "",
        salary: ""
      });

      await fetchEmployees();

      alert("Employee created successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to create employee"
      );
    }
  };

  const editEmployee = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${API_URL}/employees/${editingEmployee}`,
        {
          name: employeeForm.name,
          email: employeeForm.email,
          department: employeeForm.department,
          position: employeeForm.position,
          salary: Number(employeeForm.salary)
        },
        authConfig
      );

      setEmployeeForm({
        name: "",
        email: "",
        department: "",
        position: "",
        salary: ""
      });

      setEditingEmployee(null);

      await fetchEmployees();

      alert("Employee updated successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to update employee"
      );
    }
  };

  const startEditEmployee = (employee) => {
    setEditingEmployee(employee._id);

    setEmployeeForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      salary: employee.salary
    });

    setActivePage("Employees");
  };

  const deleteEmployee = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/employees/${id}`,
        authConfig
      );

      await fetchEmployees();

      alert("Employee deleted successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to delete employee"
      );
    }
  };

  const cancelEmployeeEdit = () => {
    setEditingEmployee(null);

    setEmployeeForm({
      name: "",
      email: "",
      department: "",
      position: "",
      salary: ""
    });
  };

  // =========================
  // SALARY
  // =========================

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/salaries`,
        authConfig
      );

      setSalaries(response.data.data || []);
    } catch (error) {
      console.error("Salary error:", error);
    }
  };

  const addSalary = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/salaries`,
        {
          employee: salaryForm.employee,
          basicSalary: Number(salaryForm.basicSalary),
          allowances: Number(salaryForm.allowances || 0),
          effectiveDate: salaryForm.effectiveDate
        },
        authConfig
      );

      setSalaryForm({
        employee: "",
        basicSalary: "",
        allowances: "",
        effectiveDate: ""
      });

      await fetchSalaries();

      alert("Salary record created successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to create salary"
      );
    }
  };

  const editSalary = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${API_URL}/salaries/${editingSalary}`,
        {
          employee: salaryForm.employee,
          basicSalary: Number(salaryForm.basicSalary),
          allowances: Number(salaryForm.allowances || 0),
          effectiveDate: salaryForm.effectiveDate
        },
        authConfig
      );

      setSalaryForm({
        employee: "",
        basicSalary: "",
        allowances: "",
        effectiveDate: ""
      });

      setEditingSalary(null);

      await fetchSalaries();

      alert("Salary updated successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to update salary"
      );
    }
  };

  const startEditSalary = (salary) => {
    setEditingSalary(salary._id);

    setSalaryForm({
      employee: salary.employee?._id || salary.employee || "",
      basicSalary: salary.basicSalary,
      allowances: salary.allowances || "",
      effectiveDate: salary.effectiveDate
        ? new Date(salary.effectiveDate)
            .toISOString()
            .split("T")[0]
        : ""
    });

    setActivePage("Salary");
  };

  const deleteSalary = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this salary record?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/salaries/${id}`,
        authConfig
      );

      await fetchSalaries();

      alert("Salary deleted successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to delete salary"
      );
    }
  };

  const cancelSalaryEdit = () => {
    setEditingSalary(null);

    setSalaryForm({
      employee: "",
      basicSalary: "",
      allowances: "",
      effectiveDate: ""
    });
  };

  // =========================
  // DEDUCTIONS
  // =========================

  const fetchDeductions = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/deductions`,
        authConfig
      );

      setDeductions(response.data.data || []);
    } catch (error) {
      console.error("Deduction error:", error);
    }
  };

  const addDeduction = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/deductions`,
        {
          employee: deductionForm.employee,
          type: deductionForm.type,
          amount: Number(deductionForm.amount),
          description: deductionForm.description
        },
        authConfig
      );

      setDeductionForm({
        employee: "",
        type: "",
        amount: "",
        description: ""
      });

      await fetchDeductions();

      alert("Deduction created successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to create deduction"
      );
    }
  };

  const editDeduction = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${API_URL}/deductions/${editingDeduction}`,
        {
          employee: deductionForm.employee,
          type: deductionForm.type,
          amount: Number(deductionForm.amount),
          description: deductionForm.description
        },
        authConfig
      );

      setDeductionForm({
        employee: "",
        type: "",
        amount: "",
        description: ""
      });

      setEditingDeduction(null);

      await fetchDeductions();

      alert("Deduction updated successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to update deduction"
      );
    }
  };

  const startEditDeduction = (deduction) => {
    setEditingDeduction(deduction._id);

    setDeductionForm({
      employee: deduction.employee?._id || deduction.employee || "",
      type: deduction.type,
      amount: deduction.amount,
      description: deduction.description || ""
    });

    setActivePage("Deductions");
  };

  const deleteDeduction = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this deduction?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/deductions/${id}`,
        authConfig
      );

      await fetchDeductions();

      alert("Deduction deleted successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to delete deduction"
      );
    }
  };

  const cancelDeductionEdit = () => {
    setEditingDeduction(null);

    setDeductionForm({
      employee: "",
      type: "",
      amount: "",
      description: ""
    });
  };

  // =========================
  // PAYROLL
  // =========================

  const fetchPayrolls = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/payrolls`,
        authConfig
      );

      setPayrolls(response.data.data || []);
    } catch (error) {
      console.error("Payroll error:", error);
    }
  };

  const runPayroll = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/payrolls/run`,
        {
          employeeId: payrollForm.employeeId,
          payPeriod: payrollForm.payPeriod
        },
        authConfig
      );

      await fetchPayrolls();

      alert("Payroll processed successfully");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to process payroll";

      alert("Payroll Error: " + message);
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    if (loggedIn) {
      fetchEmployees();
      fetchSalaries();
      fetchDeductions();
      fetchPayrolls();
    }
  }, [loggedIn]);

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-box">

          <div className="login-logo">
            SP
          </div>

          <h1>Simple Payroll</h1>

          <p className="login-subtitle">
            Admin Login
          </p>

          <form onSubmit={login}>

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {loginError && (
              <div className="error-message">
                {loginError}
              </div>
            )}

          </form>

        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="app">

      <header className="topbar">

        <div>
          <h1>Simple Payroll App</h1>
          <p>Payroll Management System</p>
        </div>

        <button
          className="logout-button"
          type="button"
          onClick={logout}
        >
          Logout
        </button>

      </header>

      <div className="layout">

        <aside className="sidebar">

          <div className="sidebar-title">

            <div className="sidebar-logo">
              SP
            </div>

            <div>
              <strong>Payroll</strong>
              <small>Management</small>
            </div>

          </div>

          <nav>

            <button
              type="button"
              className={
                activePage === "Dashboard"
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => setActivePage("Dashboard")}
            >
              <span>▣</span>
              Dashboard
            </button>

            <button
              type="button"
              className={
                activePage === "Employees"
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => setActivePage("Employees")}
            >
              <span>👥</span>
              Employees
            </button>

            <button
              type="button"
              className={
                activePage === "Salary"
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => setActivePage("Salary")}
            >
              <span>₦</span>
              Salary
            </button>

            <button
              type="button"
              className={
                activePage === "Deductions"
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => setActivePage("Deductions")}
            >
              <span>−</span>
              Deductions
            </button>

            <button
              type="button"
              className={
                activePage === "Payroll"
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => setActivePage("Payroll")}
            >
              <span>▤</span>
              Payroll
            </button>

          </nav>

          <div className="sidebar-footer">
            <small>Simple Payroll App</small>
            <small>Admin Panel</small>
          </div>

        </aside>

        <main className="content">

          {/* DASHBOARD */}

          {activePage === "Dashboard" && (
            <>
              <div className="page-header">

                <div>
                  <h2>Dashboard</h2>
                  <p>
                    Welcome to Simple Payroll
                  </p>
                </div>

              </div>

              <div className="stats-grid">

                <div className="stat-card">

                  <div className="stat-icon">
                    👥
                  </div>

                  <div>
                    <span>Employees</span>
                    <strong>
                      {employees.length}
                    </strong>
                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    ₦
                  </div>

                  <div>
                    <span>Salary Records</span>
                    <strong>
                      {salaries.length}
                    </strong>
                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    −
                  </div>

                  <div>
                    <span>Deductions</span>
                    <strong>
                      {deductions.length}
                    </strong>
                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    ▤
                  </div>

                  <div>
                    <span>Payroll Runs</span>
                    <strong>
                      {payrolls.length}
                    </strong>
                  </div>

                </div>

              </div>

              <div className="welcome-card">

                <div>
                  <h3>
                    Payroll Management
                  </h3>

                  <p>
                    Manage employees, salaries,
                    deductions and payroll from one place.
                  </p>
                </div>

                <button
                  type="button"
                  className="primary-button small"
                  onClick={() =>
                    setActivePage("Employees")
                  }
                >
                  Manage Employees
                </button>

              </div>
            </>
          )}

          {/* EMPLOYEES */}

          {activePage === "Employees" && (
            <>

              <div className="page-header">

                <div>
                  <h2>Employees</h2>

                  <p>
                    Add and manage your employees.
                  </p>
                </div>

              </div>

              <div className="form-card">

                <h3>
                  {editingEmployee
                    ? "Edit Employee"
                    : "Add Employee"}
                </h3>

                <form
                  className="form-grid"
                  onSubmit={
                    editingEmployee
                      ? editEmployee
                      : addEmployee
                  }
                >

                  <div>

                    <label>Name</label>

                    <input
                      type="text"
                      placeholder="Employee name"
                      value={employeeForm.name}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          name: e.target.value
                        })
                      }
                      required
                    />

                  </div>

                  <div>

                    <label>Email</label>

                    <input
                      type="email"
                      placeholder="Employee email"
                      value={employeeForm.email}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          email: e.target.value
                        })
                      }
                      required
                    />

                  </div>

                  <div>

                    <label>Department</label>

                    <input
                      type="text"
                      placeholder="e.g. Finance"
                      value={employeeForm.department}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          department: e.target.value
                        })
                      }
                      required
                    />

                  </div>

                  <div>

                    <label>Position</label>

                    <input
                      type="text"
                      placeholder="e.g. Accountant"
                      value={employeeForm.position}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          position: e.target.value
                        })
                      }
                      required
                    />

                  </div>

                  <div>

                    <label>Salary</label>

                    <input
                      type="number"
                      placeholder="e.g. 250000"
                      value={employeeForm.salary}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          salary: e.target.value
                        })
                      }
                      required
                    />

                  </div>

                  <div className="form-action">

                    <button
                      className="primary-button"
                      type="submit"
                    >
                      {editingEmployee
                        ? "Update Employee"
                        : "Add Employee"}
                    </button>

                    {editingEmployee && (
                      <button
                        className="cancel-button"
                        type="button"
                        onClick={cancelEmployeeEdit}
                      >
                        Cancel
                      </button>
                    )}

                  </div>

                </form>

              </div>

              <div className="table-card">

                <div className="table-header">

                  <h3>
                    Employee List
                  </h3>

                  <span>
                    {employees.length} employees
                  </span>

                </div>

                {employees.length === 0 ? (
                  <p className="empty">
                    No employees found.
                  </p>
                ) : (
                  <div className="table-container">

                    <table>

                      <thead>

                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Department</th>
                          <th>Position</th>
                          <th>Salary</th>
                          <th>Actions</th>
                        </tr>

                      </thead>

                      <tbody>

                        {employees.map((employee) => (
                          <tr key={employee._id}>

                            <td>
                              <strong>
                                {employee.name}
                              </strong>
                            </td>

                            <td>
                              {employee.email}
                            </td>

                            <td>
                              <span className="badge">
                                {employee.department}
                              </span>
                            </td>

                            <td>
                              {employee.position}
                            </td>

                            <td>
                              {formatMoney(
                                employee.salary
                              )}
                            </td>

                            <td>

                              <div className="action-buttons">

                                <button
                                  className="edit-button"
                                  type="button"
                                  onClick={() =>
                                    startEditEmployee(employee)
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  className="delete-button"
                                  type="button"
                                  onClick={() =>
                                    deleteEmployee(
                                      employee._id
                                    )
                                  }
                                >
                                  Delete
                                </button>

                              </div>

                            </td>

                          </tr>
                        ))}

                      </tbody>

                    </table>

                  </div>
                )}

              </div>

            </>
          )}

          {/* SALARY */}

          {activePage === "Salary" && (
            <>

              <div className="page-header">

                <div>
                  <h2>Salary</h2>

                  <p>
                    Manage employee salary records.
                  </p>
                </div>

              </div>

              <div className="form-card">

                <h3>
                  {editingSalary
                    ? "Edit Salary Record"
                    : "Add Salary Record"}
                </h3>

                <form
                  className="form-grid"
                  onSubmit={
                    editingSalary
                      ? editSalary
                      : addSalary
                  }
                >

                  <div>

                    <label>Employee</label>

                    <select
                      value={salaryForm.employee}
                      onChange={(e) =>
                        setSalaryForm({
                          ...salaryForm,
                          employee: e.target.value
                        })
                      }
                      required
                    >

                      <option value="">
                        Select employee
                      </option>

                      {employees.map((employee) => (
                        <option
                          key={employee._id}
                          value={employee._id}
                        >
                          {employee.name}
                        </option>
                      ))}

                    </select>

                  </div>

                  <div>

                    <label>Basic Salary</label>

                    <input
                      type="number"
                      placeholder="250000"
                      value={salaryForm.basicSalary}
                      onChange={(e) =>
                        setSalaryForm({
                          ...salaryForm,
                          basicSalary: e.target.value
                        })
                      }
                      required
                    />

                  </div>

                  <div>

                    <label>Allowances</label>

                    <input
                      type="number"
                      placeholder="50000"
                      value={salaryForm.allowances}
                      onChange={(e) =>
                        setSalaryForm({
                          ...salaryForm,
                          allowances: e.target.value
                        })
                      }
                    />

                  </div>

                  <div>

                    <label>Effective Date</label>

                    <input
                      type="date"
                      value={salaryForm.effectiveDate}
                      onChange={(e) =>
                        setSalaryForm({
                          ...salaryForm,
                          effectiveDate: e.target.value
                        })
                      }
                      required
                    />

                  </div>

                  <div className="form-action">

                    <button
                      className="primary-button"
                      type="submit"
                    >
                      {editingSalary
                        ? "Update Salary"
                        : "Add Salary"}
                    </button>

                    {editingSalary && (
                      <button
                        className="cancel-button"
                        type="button"
                        onClick={cancelSalaryEdit}
                      >
                        Cancel
                      </button>
                    )}

                  </div>

                </form>

              </div>

              <div className="table-card">

                <div className="table-header">

                  <h3>
                    Salary Records
                  </h3>

                  <span>
                    {salaries.length} records
                  </span>

                </div>

                {salaries.length === 0 ? (
                  <p className="empty">
                    No salary records found.
                  </p>
                ) : (
                  <div className="table-container">

                    <table>

                      <thead>

                        <tr>
                          <th>Employee</th>
                          <th>Basic Salary</th>
                          <th>Allowances</th>
                          <th>Effective Date</th>
                          <th>Actions</th>
                        </tr>

                      </thead>

                      <tbody>

                        {salaries.map((salary) => (
                          <tr key={salary._id}>

                            <td>
                              <strong>
                                {salary.employee?.name ||
                                  "Employee"}
                              </strong>
                            </td>

                            <td>
                              {formatMoney(
                                salary.basicSalary
                              )}
                            </td>

                            <td>
                              {formatMoney(
                                salary.allowances
                              )}
                            </td>

                            <td>
                              {new Date(
                                salary.effectiveDate
                              ).toLocaleDateString()}
                            </td>

                            <td>

                              <div className="action-buttons">

                                <button
                                  className="edit-button"
                                  type="button"
                                  onClick={() =>
                                    startEditSalary(salary)
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  className="delete-button"
                                  type="button"
                                  onClick={() =>
                                    deleteSalary(
                                      salary._id
                                    )
                                  }
                                >
                                  Delete
                                </button>

                              </div>

                            </td>

                          </tr>
                        ))}

                      </tbody>

                    </table>

                  </div>
                )}

              </div>

            </>
          )}

          {/* DEDUCTIONS */}

          {activePage === "Deductions" && (
            <>

              <div className="page-header">

                <div>
                  <h2>Deductions</h2>

                  <p>
                    Manage employee deductions.
                  </p>
                </div>

              </div>

              <div className="form-card">

                <h3>
                  {editingDeduction
                    ? "Edit Deduction"
                    : "Add Deduction"}
                </h3>

                <form
                  className="form-grid"
                  onSubmit={
                    editingDeduction
                      ? editDeduction
                      : addDeduction
                  }
                >

                  <div>

                    <label>Employee</label>

                    <select
                      value={deductionForm.employee}
                      onChange={(e) =>
                        setDeductionForm({
                          ...deductionForm,
                          employee: e.target.value
                        })
                      }
                      required
                    >

                      <option value="">
                        Select employee
                      </option>

                      {employees.map((employee) => (
                        <option
                          key={employee._id}
                          value={employee._id}
                        >
                          {employee.name}
                        </option>
                      ))}

                    </select>

                  </div>

                  <div>

                    <label>Deduction Type</label>

                    <input
                      type="text"
                      placeholder="e.g. Tax"
                      value={deductionForm.type}
                      onChange={(e) =>
                        setDeductionForm({
                          ...deductionForm,
                          type: e.target.value
                        })
                      }
                      required
                    />

                  </div>

                  <div>

                    <label>Amount</label>

                    <input
                      type="number"
                      placeholder="20000"
                      value={deductionForm.amount}
                      onChange={(e) =>
                        setDeductionForm({
                          ...deductionForm,
                          amount: e.target.value
                        })
                      }
                      required
                    />

                  </div>

                  <div>

                    <label>Description</label>

                    <input
                      type="text"
                      placeholder="Monthly tax"
                      value={deductionForm.description}
                      onChange={(e) =>
                        setDeductionForm({
                          ...deductionForm,
                          description: e.target.value
                        })
                      }
                    />

                  </div>

                  <div className="form-action">

                    <button
                      className="primary-button"
                      type="submit"
                    >
                      {editingDeduction
                        ? "Update Deduction"
                        : "Add Deduction"}
                    </button>

                    {editingDeduction && (
                      <button
                        className="cancel-button"
                        type="button"
                        onClick={cancelDeductionEdit}
                      >
                        Cancel
                      </button>
                    )}

                  </div>

                </form>

              </div>

              <div className="table-card">

                <div className="table-header">

                  <h3>
                    Deduction Records
                  </h3>

                  <span>
                    {deductions.length} records
                  </span>

                </div>

                {deductions.length === 0 ? (
                  <p className="empty">
                    No deductions found.
                  </p>
                ) : (
                  <div className="table-container">

                    <table>

                      <thead>

                        <tr>
                          <th>Employee</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>

                      </thead>

                      <tbody>

                        {deductions.map((deduction) => (
                          <tr key={deduction._id}>

                            <td>
                              <strong>
                                {deduction.employee?.name ||
                                  "Employee"}
                              </strong>
                            </td>

                            <td>
                              <span className="badge warning">
                                {deduction.type}
                              </span>
                            </td>

                            <td>
                              {formatMoney(
                                deduction.amount
                              )}
                            </td>

                            <td>
                              {deduction.description || "-"}
                            </td>

                            <td>

                              <div className="action-buttons">

                                <button
                                  className="edit-button"
                                  type="button"
                                  onClick={() =>
                                    startEditDeduction(
                                      deduction
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  className="delete-button"
                                  type="button"
                                  onClick={() =>
                                    deleteDeduction(
                                      deduction._id
                                    )
                                  }
                                >
                                  Delete
                                </button>

                              </div>

                            </td>

                          </tr>
                        ))}

                      </tbody>

                    </table>

                  </div>
                )}

              </div>

            </>
          )}

          {/* PAYROLL */}

          {activePage === "Payroll" && (
            <>

              <div className="page-header">

                <div>
                  <h2>Payroll</h2>

                  <p>
                    Process employee payroll.
                  </p>
                </div>

              </div>

              <div className="form-card">

                <h3>
                  Process Payroll
                </h3>

                <form
                  className="form-grid"
                  onSubmit={runPayroll}
                >

                  <div>

                    <label>Employee</label>

                    <select
                      value={payrollForm.employeeId}
                      onChange={(e) =>
                        setPayrollForm({
                          ...payrollForm,
                          employeeId: e.target.value
                        })
                      }
                      required
                    >

                      <option value="">
                        Select employee
                      </option>

                      {employees.map((employee) => (
                        <option
                          key={employee._id}
                          value={employee._id}
                        >
                          {employee.name}
                        </option>
                      ))}

                    </select>

                  </div>

                  <div>

                    <label>Pay Period</label>

                    <input
                      type="text"
                      value={payrollForm.payPeriod}
                      onChange={(e) =>
                        setPayrollForm({
                          ...payrollForm,
                          payPeriod: e.target.value
                        })
                      }
                      required
                    />

                  </div>

                  <div className="form-action">

                    <button
                      className="primary-button"
                      type="submit"
                    >
                      Process Payroll
                    </button>

                  </div>

                </form>

              </div>

              <div className="table-card">

                <div className="table-header">

                  <h3>
                    Payroll History
                  </h3>

                  <span>
                    {payrolls.length} records
                  </span>

                </div>

                {payrolls.length === 0 ? (
                  <p className="empty">
                    No payroll records found.
                  </p>
                ) : (
                  <div className="table-container">

                    <table>

                      <thead>

                        <tr>
                          <th>Employee</th>
                          <th>Gross Salary</th>
                          <th>Deductions</th>
                          <th>Net Salary</th>
                          <th>Period</th>
                          <th>Status</th>
                        </tr>

                      </thead>

                      <tbody>

                        {payrolls.map((payroll) => (
                          <tr key={payroll._id}>

                            <td>
                              <strong>
                                {payroll.employee?.name ||
                                  "Employee"}
                              </strong>
                            </td>

                            <td>
                              {formatMoney(
                                payroll.grossSalary
                              )}
                            </td>

                            <td>
                              {formatMoney(
                                payroll.totalDeductions
                              )}
                            </td>

                            <td className="net-salary">
                              {formatMoney(
                                payroll.netSalary
                              )}
                            </td>

                            <td>
                              {payroll.payPeriod}
                            </td>

                            <td>
                              <span className="status">
                                {payroll.status}
                              </span>
                            </td>

                          </tr>
                        ))}

                      </tbody>

                    </table>

                  </div>
                )}

              </div>

            </>
          )}

        </main>

      </div>

    </div>
  );
}

export default App;
import db from "../config/db.js";

// Ge All Employee Details 
export const getEmployees = (req, res) => {
  db.query("SELECT * FROM employees ORDER BY id DESC", (err, result) => {
    if (err) {
      console.log("GET ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
};

// Add employee details
export const addEmployee = (req, res) => {
  let { name, email, position, salary, mobn, address } = req.body;
  salary = Number(salary);

  if (!name || !email || !position || !salary || !mobn || !address) {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql = "INSERT INTO employees (name,email,position,salary, mobn, address) VALUES (?,?,?,?,?,?)";

  db.query(sql, [name, email, position, salary, mobn, address], (err) => {
    if (err) {
      console.log("INSERT ERROR:", err);
      return res.status(500).json(err);
    }
    res.json({ message: "Employee Added" });
  });
};

// Update employee Details
export const updateEmployee = (req, res) => {
  const { id } = req.params;
  let { name, email, position, salary, mobn, address } = req.body;
  salary = Number(salary);

  const sql = "UPDATE employees SET name=?, email=?, position=?, salary=?, mobn=?, address=? WHERE id=?";

  db.query(sql, [name, email, position, salary, mobn, address, id], (err) => {
    if (err) {
      console.log("UPDATE ERROR:", err);
      return res.status(500).json(err);
    }
    res.json({ message: "Employee Updated" });
  });
};

// delete Employee Details
export const deleteEmployee = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM employees WHERE id=?", [id], (err) => {
    if (err) {
      console.log("DELETE ERROR:", err);
      return res.status(500).json(err);
    }
    res.json({ message: "Employee Deleted" });
  });
};


import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:5000";

function App() {
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    salary: "",
    mobn: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const validate = () => {
    const errs = {};

    if (!form.name.trim()) errs.name = "Name required";

    if (!form.email.trim()) errs.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";

    if (!form.position.trim()) errs.position = "Position required";
    if (!form.salary) errs.salary = "Salary required";
    else if (form.salary <= 0) errs.salary = "Salary must be > 0";
    else if (!form.mobn) errs.mobn = "Mobile number is required";
    else if (!form.address) errs.mobn = "Address is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editId) {
        await axios.put(`${API_URL}/employees/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post(`${API_URL}/employees`, form);
      }

      setForm({
        name: "",
        email: "",
        position: "",
        salary: "",
        mobn: "",
        address: "",
      });
      setErrors({});
      fetchEmployees();
    } catch (err) {
      console.error("Save error:", err.message);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/employees/${id}`);
    fetchEmployees();
  };

  const handleEdit = (emp) => {
    setEditId(emp.id);
    setForm({
      name: emp.name,
      email: emp.email,
      position: emp.position,
      salary: emp.salary,
      mobn: emp.mobn,
      address: emp.address,
    });
  };

  const inputClass =
    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Employee Management System
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-5 gap-10 mb-8"
        >
          <div>
            <input
              className={inputClass}
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <input
              className={inputClass}
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <input
              className={inputClass}
              placeholder="Position"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            />
          </div>

          <div>
            <input
              type="number"
              className={inputClass}
              placeholder="Salary"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
            />
          </div>

          <div>
            <input
              type="number"
              className={inputClass}
              placeholder="Mobile Number"
              value={form.mobn}
              onChange={(e) => setForm({ ...form, mobn: e.target.value })}
            />
          </div>
          <div>
            <input
              type="text"
              className={inputClass}
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <button
            className={`rounded-lg text-white font-semibold ${
              editId
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editId ? "Update" : "Add"}
          </button>
        </form>

        <div className="overflow-x-auto">
          <table
            className="w-full border rounded-xl overflow-hidden"
            border={1}
          >
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Salary</th>
                <th>MobNum</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="text-center border-t hover:bg-gray-50"
                >
                  <td className="p-3">{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.position}</td>
                  <td>₹ {emp.salary}</td>
                  <td>{emp.mobn}</td>
                  <td>{emp.address}</td>

                  <td className="space-x-2">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {employees.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 flex justify-center items-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;

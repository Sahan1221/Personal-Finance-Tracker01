import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Dashboard({ user, setUser }) {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  // Fetch transactions
  useEffect(() => {
    if (user) {
      fetch("http://localhost:5000/api/transactions/get", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setTransactions(data.transactions || []);
        })
        .catch(console.log);
    }
  }, [user]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/transactions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount, type, category, description, date }),
      });
      const data = await res.json();
      if (data.transaction) {
        setTransactions((prev) => [...prev, data.transaction]);
        setAmount(""); setCategory(""); setDescription(""); setDate(""); setType("income");
      } else alert(data.error || "Error adding transaction");
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  if (!user)
    return (
      <div className="dashboard-guest">
        <h2>Access Your Dashboard</h2>
        <p>Please login to see your financial overview.</p>
      </div>
    );

  // Prepare chart data
  const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);

  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#1db954", "#ff4b5c"],
      },
    ],
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}!</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="dashboard-content">
        <div className="add-transaction">
          <h2>Add Transaction</h2>
          <form onSubmit={handleAddTransaction}>
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <button type="submit">Add</button>
          </form>
        </div>

        <div className="transactions-list">
          <h2>Transactions</h2>
          {transactions.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id}>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td>{t.type}</td>
                    <td>{t.category}</td>
                    <td>{t.description}</td>
                    <td>{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="charts">
          <div className="chart-container">
            <h3>Income vs Expense</h3>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}

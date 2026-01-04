import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Dashboard({ user, setUser }) {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");



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

  // Add transaction
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost:5000/api/transactions/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            amount,
            type,
            category,
            description,
            date,
          }),
        }
      );

      const data = await res.json();

      if (data.transaction) {
        setTransactions((prev) => [...prev, data.transaction]);
        setAmount("");
        setCategory("");
        setDescription("");
        setDate("");
        setType("income");
      } else {
        alert(data.error || "Error adding transaction");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  // Delete transaction
  const handleDeleteTransaction = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/transactions/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setTransactions((prev) =>
          prev.filter((t) => t._id !== id)
        );
      } else {
         alert(data.error || "Failed to delete transaction");
      }

    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  // Edit Transaction
  const handleEditClick = (transaction) => {
    setIsEditing(true);
    setEditId(transaction._id);

    setAmount(transaction.amount);
    setType(transaction.type);
    setCategory(transaction.category);
    setDescription(transaction.description);
    setDate(transaction.date.split("T")[0]);
};

// Update Transaction Handler
const handleUpdateTransaction = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(
      `http://localhost:5000/api/transactions/edit/${editId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount,
          type,
          category,
          description,
          date,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setTransactions((prev) =>
        prev.map((t) =>
          t._id === editId ? data.transaction : t
        )
      );

      // Reset form
      setIsEditing(false);
      setEditId(null);
      setAmount("");
      setType("income");
      setCategory("");
      setDescription("");
      setDate("");
    } else {
      alert(data.error || "Failed to update");
    }
  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};


  // Logout
  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  if (!user) {
    return (
      <div className="dashboard-guest">
        <h2>Access Your Dashboard</h2>
        <p>Please login to see your financial overview.</p>
      </div>
    );
  }

  // Chart data
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#1db954", "#ff4b5c"],
      },
    ],
  };

  //Filter Transaction
  const filteredTransactions = transactions.filter((t) => {
  const matchType =
    filterType === "all" || t.type === filterType;

  const matchCategory =
    filterCategory === "" ||
    t.category.toLowerCase().includes(filterCategory.toLowerCase());

  const matchDate =
    filterDate === "" ||
    t.date.split("T")[0] === filterDate;

  return matchType && matchCategory && matchDate;
});


  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}!</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="add-transaction">
          <h2>Add Transaction</h2>
          <form onSubmit={isEditing ? handleUpdateTransaction : handleAddTransaction}>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <button type="submit">{isEditing ? "Update" : "Add"}</button>
            {isEditing && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setEditId(null);
                    setAmount("");
                    setType("income");
                    setCategory("");
                    setDescription("");
                    setDate("");
                  }}
                >
                  Cancel
                </button>
              )}

          </form>
        </div>

        <div className="transactions-list">
          <h2>Transactions</h2>
          <div className="filters">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <input
              type="text"
              placeholder="Filter by category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            />

            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
    
          {filteredTransactions.length === 0 ? (
            <p>No matching transactions</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr key={t._id}>
                    <td data-label="Date">{new Date(t.date).toLocaleDateString()}</td>
                    <td data-label="Type">{t.type}</td>
                    <td data-label="Category">{t.category}</td>
                    <td data-label="Description">{t.description}</td>
                    <td data-label="Amount">{t.amount}</td>
                    <td data-label="Action">
                      <button className="edit-btn" onClick={() => handleEditClick(t)}>✏️</button>
                      <button className="delete-btn" onClick={() => handleDeleteTransaction(t._id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
               
            </table>
          )}
        </div>

        <div className="charts">
          <div className="chart-container">
            <h3>Income vs Expense</h3>
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      padding: 15,
                    },
                  },
                },
              }}
            />

          </div>
        </div>
      </div>
    </div>
  );
}

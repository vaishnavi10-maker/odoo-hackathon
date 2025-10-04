// src/components/EmployeeDashboard.jsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:8000/api"; // Django backend URL

export default function EmployeeDashboard() {
  const { accessToken, logout } = useAuth();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [expenseDate, setExpenseDate] = useState("");
  const [paidBy, setPaidBy] = useState("me");
  const [remarks, setRemarks] = useState("");
  const [myExpenses, setMyExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accessToken) {
      fetchMyExpenses();
    }
  }, [accessToken]);

  const fetchMyExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE}/expenses/my/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch expenses");

      const data = await response.json();
      setMyExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      toast.error("Could not load your expenses");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);

      // Simulated OCR auto-fill
      setTimeout(() => {
        setAmount("125.50");
        setCategory("meals");
        setDescription("Restaurant receipt — client meeting");
        toast.success("Receipt processed! Fields auto-filled via OCR.");
      }, 1000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("expense_date", expenseDate);
      formData.append("paid_by", paidBy);
      formData.append("remarks", remarks);
      if (receipt) formData.append("receipt", receipt);

      const response = await fetch(`${API_BASE}/expenses/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
        return;
      }

      if (response.ok) {
        toast.success("Expense submitted successfully!");
        // Reset form
        setAmount("");
        setCategory("");
        setDescription("");
        setReceipt(null);
        setExpenseDate("");
        setPaidBy("me");
        setRemarks("");
        fetchMyExpenses();
      } else {
        const errJson = await response.json();
        const errMsg =
          errJson.error || errJson.detail || "Failed to submit expense";
        toast.error(errMsg);
      }
    } catch (error) {
      console.error("Submit expense error:", error);
      toast.error("Failed to submit expense");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const cls = variants[status?.toLowerCase()] || variants.pending;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${cls}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-4">
      {/* Expense Submission Form */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Submit New Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <input
              type="file"
              id="receipt"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="text-sm"
            />
            <span className="text-gray-600 text-sm">
              Draft → Waiting Approval → Approved
            </span>
          </div>
          {receipt && (
            <p className="text-sm text-gray-700">
              Selected file: <strong>{receipt.name}</strong>
            </p>
          )}

          {/* Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="col-span-3">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                placeholder="Describe the expense..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                required
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Expense Date
              </label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
              >
                <option value="">Select category</option>
                <option value="travel">Travel</option>
                <option value="meals">Meals & Entertainment</option>
                <option value="equipment">Equipment</option>
                <option value="software">Software</option>
                <option value="office">Office Supplies</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Paid By</label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
              >
                <option value="me">Me</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Remarks</label>
              <input
                type="text"
                placeholder="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Expense"}
          </button>
        </form>
      </div>

      {/* My Expenses List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">My Submitted Expenses</h2>
        {myExpenses.length === 0 ? (
          <p>No expenses submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {myExpenses.map((exp) => (
                  <tr key={exp.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{exp.id}</td>
                    <td className="px-4 py-2 capitalize">{exp.category}</td>
                    <td className="px-4 py-2 font-medium">₹{exp.amount}</td>
                    <td className="px-4 py-2">
                      {new Date(exp.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{getStatusBadge(exp.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

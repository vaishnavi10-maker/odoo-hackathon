// src/components/ManagerDashboard.jsx
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:8000/api"; // Django backend URL

export default function ManagerDashboard() {
  const { accessToken } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending expenses from backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${API_BASE}/expenses/pending/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch expense requests");
        }

        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error(error);
        toast.error("Could not load expense requests.");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchRequests();
    }
  }, [accessToken]);

  // Approve / Reject handler
  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`${API_BASE}/expenses/${id}/${action}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Action failed");
      }

      toast.success(`Request ${action}d`);
      setRequests((prev) => prev.filter((req) => req.id !== id)); // remove after action
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${action} request`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white py-10 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-amber-600 drop-shadow-sm">
          📝 Manager Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Review and approve expense requests below
        </p>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Requests Table */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-amber-700 mb-6">
          Approvals to Review
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-500">No requests available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-amber-200 rounded-lg overflow-hidden">
              <thead className="bg-amber-100 text-amber-800">
                <tr>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Employee</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-center">Approve</th>
                  <th className="px-4 py-3 text-center">Reject</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr
                    key={req.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-amber-50"
                    } hover:bg-amber-100 transition duration-200`}
                  >
                    <td className="px-4 py-2 border-t border-amber-200">
                      {req.description}
                    </td>
                    <td className="px-4 py-2 border-t border-amber-200">
                      {req.user?.name || "Unknown"}
                    </td>
                    <td className="px-4 py-2 border-t border-amber-200 capitalize">
                      {req.category}
                    </td>
                    <td className="px-4 py-2 border-t border-amber-200 font-semibold text-gray-700">
                      {req.status}
                    </td>
                    <td className="px-4 py-2 border-t border-amber-200">
                      ₹{req.amount}
                    </td>
                    <td className="px-4 py-2 border-t border-amber-200 text-center">
                      <button
                        onClick={() => handleAction(req.id, "approve")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                    </td>
                    <td className="px-4 py-2 border-t border-amber-200 text-center">
                      <button
                        onClick={() => handleAction(req.id, "reject")}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </td>
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

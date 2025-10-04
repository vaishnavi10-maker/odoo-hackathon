// src/components/AdminView.jsx
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:8000/api";

export default function AdminView() {
  const { accessToken } = useAuth();

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [manager, setManager] = useState("");
  const [isManagerApprover, setIsManagerApprover] = useState(false);
  const [approvers, setApprovers] = useState([]);
  const [sequential, setSequential] = useState(false);
  const [minApproval, setMinApproval] = useState("");
  const [loading, setLoading] = useState(false);

  // load all existing users for manager/approver dropdowns
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load users");
      }
    };
    if (accessToken) fetchUsers();
  }, [accessToken]);

  const handleApproverChange = (index, key, value) => {
    const updated = [...approvers];
    updated[index][key] = value;
    setApprovers(updated);
  };

  const addApprover = () => {
    setApprovers([...approvers, { user: "", required: false }]);
  };

  const removeApprover = (index) => {
    setApprovers(approvers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return toast.error("Enter a username");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/approval-rules/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          description,
          manager,
          is_manager_approver: isManagerApprover,
          approvers,
          sequential,
          min_approval: minApproval,
        }),
      });

      if (!res.ok) throw new Error("Failed to save approval rule");
      toast.success("Approval rule saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save rule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin View</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 space-y-6 max-w-5xl mx-auto"
      >
        {/* User input (text only) */}
        <div>
          <label className="block font-medium mb-1">User</label>
          <input
            type="text"
            placeholder="e.g. marc"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter username. If not found, a new user will be created.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <input
            type="text"
            placeholder="Approval rule for miscellaneous expenses"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Manager dropdown */}
        <div>
          <label className="block font-medium mb-1">Manager</label>
          <select
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200"
          >
            <option value="">Select manager</option>
            {users
              .filter((u) => u.role === "Manager")
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name || m.username}
                </option>
              ))}
          </select>
        </div>

        {/* Manager approver checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isManagerApprover}
            onChange={(e) => setIsManagerApprover(e.target.checked)}
          />
          <label className="text-sm text-gray-700">
            Is manager an approver? (If checked, request goes to manager first)
          </label>
        </div>

        {/* Approvers Table */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Approvers</h2>
            <button
              type="button"
              onClick={addApprover}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              + Add Approver
            </button>
          </div>
          <table className="w-full border rounded-lg text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">User</th>
                <th className="p-2 border">Required</th>
                <th className="p-2 border"></th>
              </tr>
            </thead>
            <tbody>
              {approvers.map((a, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">
                    <select
                      value={a.user}
                      onChange={(e) =>
                        handleApproverChange(index, "user", e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full"
                    >
                      <option value="">Select</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name || u.username}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={a.required}
                      onChange={(e) =>
                        handleApproverChange(index, "required", e.target.checked)
                      }
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeApprover(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sequential Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sequential}
            onChange={(e) => setSequential(e.target.checked)}
          />
          <label className="text-sm text-gray-700">
            Approvers Sequence (if checked, follow listed order)
          </label>
        </div>

        {/* Minimum Approval Percentage */}
        <div>
          <label className="block font-medium mb-1">Minimum Approval Percentage</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="e.g. 75"
              value={minApproval}
              onChange={(e) => setMinApproval(e.target.value)}
              className="border rounded-lg px-3 py-2 w-24 focus:ring focus:ring-blue-200"
            />
            <span>%</span>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Approval Rule"}
          </button>
        </div>
      </form>
    </div>
  );
}

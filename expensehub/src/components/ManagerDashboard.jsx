import React, { useState } from 'react';

function ManagerDashboard() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      subject: 'Team Lunch',
      owner: 'Sarah',
      category: 'Food',
      status: 'Pending',
      amount: 445,
      isFinalized: false,
    },
    {
      id: 2,
      subject: 'Conference Tickets',
      owner: 'John',
      category: 'Travel',
      status: 'Pending',
      amount: 1200,
      isFinalized: false,
    },
  ]);

  const handleAction = (id, action) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: action === 'approve' ? 'Approved' : 'Rejected',
              isFinalized: true,
            }
          : req
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white py-10 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-amber-600 drop-shadow-sm">
          📝 Manager Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Review and approve expense requests below</p>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Table Container */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-amber-700 mb-6">Approvals to Review</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-amber-200 rounded-lg overflow-hidden">
            <thead className="bg-amber-100 text-amber-800">
              <tr>
                <th className="px-4 py-3 text-left">Approval Subject</th>
                <th className="px-4 py-3 text-left">Request Owner</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Request Status</th>
                <th className="px-4 py-3 text-left">Total Amount</th>
                <th className="px-4 py-3 text-left">Approve</th>
                <th className="px-4 py-3 text-left">Reject</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr
                  key={req.id}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-amber-50'
                  } hover:bg-amber-100 transition duration-200`}
                >
                  <td className="px-4 py-2 border-t border-amber-200">{req.subject}</td>
                  <td className="px-4 py-2 border-t border-amber-200">{req.owner}</td>
                  <td className="px-4 py-2 border-t border-amber-200">{req.category}</td>
                  <td
                    className={`px-4 py-2 border-t border-amber-200 font-semibold ${
                      req.status === 'Approved'
                        ? 'text-green-600'
                        : req.status === 'Rejected'
                        ? 'text-red-600'
                        : 'text-gray-700'
                    }`}
                  >
                    {req.status}
                  </td>
                  <td className="px-4 py-2 border-t border-amber-200">${req.amount}</td>
                  <td className="px-4 py-2 border-t border-amber-200">
                    {!req.isFinalized && (
                      <button
                        onClick={() => handleAction(req.id, 'approve')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2 border-t border-amber-200">
                    {!req.isFinalized && (
                      <button
                        onClick={() => handleAction(req.id, 'reject')}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {requests.length === 0 && (
            <p className="text-center text-gray-500 py-6">No requests available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;

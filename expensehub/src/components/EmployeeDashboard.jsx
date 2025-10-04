import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

const API_BASE = `http://localhost:8000/api`; // Django backend URL

export default function EmployeeDashboard() {
  const { accessToken } = useAuth();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [receipt, setReceipt] = useState(null);
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
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMyExpenses(data);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
      // Simulate OCR auto-fill
      setTimeout(() => {
        setAmount('125.50');
        setCategory('meals');
        setDescription('Restaurant receipt - Client meeting');
        toast.success('Receipt processed! Fields auto-filled via OCR.');
      }, 1000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('category', category);
      formData.append('description', description);
      if (receipt) formData.append('receipt', receipt);

      const response = await fetch(`${API_BASE}/expenses/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success('Expense submitted successfully!');
        setAmount('');
        setCategory('');
        setDescription('');
        setReceipt(null);
        fetchMyExpenses();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit expense');
      }
    } catch (error) {
      console.error('Submit expense error:', error);
      toast.error('Failed to submit expense');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded ${variants[status] || variants.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Expense Submission Form */}
      <div className="card p-4">
        <h2 className="text-lg font-bold mb-4">Submit New Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="receipt">Upload Receipt (OCR Enabled)</label>
            <input
              type="file"
              id="receipt"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
            />
            {receipt && <p>{receipt.name}</p>}
          </div>

          <div>
            <label>Amount</label>
            <input
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
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
            <label>Description</label>
            <textarea
              placeholder="Describe the expense..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Expense'}
          </button>
        </form>
      </div>

      {/* My Expenses */}
      <div className="card p-4">
        <h2 className="text-lg font-bold mb-4">My Submitted Expenses</h2>
        {myExpenses.length === 0 ? (
          <p>No expenses submitted yet.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.id}</td>
                  <td>{exp.category}</td>
                  <td>${exp.amount}</td>
                  <td>{new Date(exp.created_at).toLocaleDateString()}</td>
                  <td>{getStatusBadge(exp.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

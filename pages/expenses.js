import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ amount: '', category: '', date: '', paymentMethod: '', notes: '', id: null });
  const [filters, setFilters] = useState({ category: '', paymentMethod: '', date: '', search: '' });
  const [token, setToken] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      if (storedToken) fetchExpenses(storedToken);
    }
  }, []);

  const fetchExpenses = async (authToken) => {
    const res = await axios.get('http://localhost:5000/api/expenses', {
      headers: { Authorization: 'Bearer ' + authToken }
    });
    setExpenses(res.data);
  };

  const saveExpense = async () => {
    const method = form.id ? 'put' : 'post';
    const url = form.id
      ? `http://localhost:5000/api/expenses/${form.id}`
      : 'http://localhost:5000/api/expenses';

    await axios[method](url, form, {
      headers: { Authorization: 'Bearer ' + token }
    });

    setForm({ amount: '', category: '', date: '', paymentMethod: '', notes: '', id: null });
    fetchExpenses(token);
  };

  const editExpense = (exp) => setForm({ ...exp, id: exp._id });

  const deleteExpense = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
      headers: { Authorization: 'Bearer ' + token }
    });
    fetchExpenses(token);
  };

  const filtered = expenses.filter(e =>
    (!filters.category || e.category === filters.category) &&
    (!filters.paymentMethod || e.paymentMethod === filters.paymentMethod) &&
    (!filters.date || e.date.slice(0, 10) === filters.date) &&
    (!filters.search || e.notes?.toLowerCase().includes(filters.search.toLowerCase()))
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Manage Expenses</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <input type="text" placeholder="Category" onChange={e => setFilters({ ...filters, category: e.target.value })} className="p-2 border rounded" />
        <input type="text" placeholder="Payment Method" onChange={e => setFilters({ ...filters, paymentMethod: e.target.value })} className="p-2 border rounded" />
        <input type="date" onChange={e => setFilters({ ...filters, date: e.target.value })} className="p-2 border rounded" />
        <input type="text" placeholder="Search Notes" onChange={e => setFilters({ ...filters, search: e.target.value })} className="p-2 border rounded" />
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-semibold mb-2">{form.id ? 'Edit' : 'Add'} Expense</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="p-2 border rounded" />
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Payment Method" value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="p-2 border rounded" />
          <button onClick={saveExpense} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{form.id ? 'Update' : 'Add'}</button>
        </div>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Payment</th>
            <th className="p-2 border">Notes</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((exp) => (
            <tr key={exp._id}>
              <td className="p-2 border">₹{exp.amount}</td>
              <td className="p-2 border">{exp.category}</td>
              <td className="p-2 border">{exp.date.slice(0, 10)}</td>
              <td className="p-2 border">{exp.paymentMethod}</td>
              <td className="p-2 border">{exp.notes}</td>
              <td className="p-2 border">
                <button onClick={() => editExpense(exp)} className="text-blue-500 mr-2">Edit</button>
                <button onClick={() => deleteExpense(exp._id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

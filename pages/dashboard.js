
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
const baseURL =  'https://backendfinancetracker-umjc.onrender.com';
export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [topCategory, setTopCategory] = useState('');
  const [topMethods, setTopMethods] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('${baseURL}/api/expenses', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setExpenses(res.data);
        const totalSpent = res.data.reduce((acc, e) => acc + e.amount, 0);
        setTotal(totalSpent);

        const categoryCount = {};
        const paymentCount = {};
        res.data.forEach(e => {
          categoryCount[e.category] = (categoryCount[e.category] || 0) + e.amount;
          paymentCount[e.paymentMethod] = (paymentCount[e.paymentMethod] || 0) + 1;
        });

        const topCat = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
        setTopCategory(topCat);

        const topPay = Object.entries(paymentCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
        setTopMethods(topPay);
      });
  }, []);

  const pieData = expenses.reduce((acc, exp) => {
    const found = acc.find(item => item.name === exp.category);
    if (found) found.value += exp.amount;
    else acc.push({ name: exp.category, value: exp.amount });
    return acc;
  }, []);

  const lineData = expenses.map(exp => ({ date: exp.date.slice(0, 10), amount: exp.amount }));

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="mb-6 space-y-2">
        <p className="text-lg">💰 Total Money Spent: <strong>₹{total}</strong></p>
        <p className="text-lg">📊 Top Category: <strong>{topCategory}</strong></p>
        <p className="text-lg">💳 Top Payment Methods: <strong>{topMethods.join(', ')}</strong></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg mb-2">Spending by Category</h2>
          <PieChart width={300} height={300}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
              {pieData.map((_, index) => <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index % 3]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div>
          <h2 className="text-lg mb-2">Spending Over Time</h2>
          <LineChart width={500} height={300} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>
    </div>
  );
}

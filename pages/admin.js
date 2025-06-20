
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="text-left p-4">User</th>
            <th className="text-left p-4">Total Spending</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={i} className="border-t">
              <td className="p-4">{user.email}</td>
              <td className="p-4">₹{user.totalSpending}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

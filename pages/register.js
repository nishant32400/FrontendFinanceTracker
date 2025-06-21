
import { useState } from 'react';
import axios from 'axios';
const baseURL =  'https://backendfinancetracker-umjc.onrender.com';
export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleRegister = async () => {
    await axios.post('${baseURL}/api/auth/register', { email, password });
    window.location.href = '/login';
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="mb-3 w-full px-3 py-2 border rounded-lg" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="mb-3 w-full px-3 py-2 border rounded-lg" />
        <button onClick={handleRegister} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700">Register</button>
      </div>
    </div>
  );
}

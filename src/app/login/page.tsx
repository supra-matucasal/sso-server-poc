'use client';
import { useState } from 'react';
import axios from 'axios';
import { usePathname, useSearchParams, redirect } from 'next/navigation'


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const searchParams = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const redirectUrl = searchParams.get('redirect') || '/';
      const state = searchParams.get('state') || '';

      const response = await axios.post('/api/auth/login', { email, password, redirectUrl, state });
      if (response.status === 200) {
        const { redirectUrl: serverRedirectUrl } = response.data;
        // Redirect to the URL provided by the server
        window.location.href = serverRedirectUrl;
      }
    } catch (error) {
      console.log(error);
      setError('Login failed');
    }
  };
  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

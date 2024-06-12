'use client';
import { useState } from 'react';
import axios from 'axios';
import { usePathname, useSearchParams, redirect } from 'next/navigation'


export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const searchParams = useSearchParams()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const redirect_url = searchParams.get('redirect_url') || '/';
      const state = searchParams.get('state') || '';

      const response = await axios.post('/api/auth/signup', { email, password, redirect_url, state });
      if (response.status === 200) {
        const { redirectUrl: serverRedirectUrl } = response.data;
        //console.log('I have to redirect to: ', serverRedirectUrl)
        // Redirect to the URL provided by the server
        window.location.href = serverRedirectUrl;
      }
    } catch (error) {
      console.log(error);
      setError('Signup failed');
    }
  };
  return (
    <div style={{ display: 'flex', margin: '1vh', justifyContent: 'center', minHeight: '100vh', }}>
    <div style={{ border: '1px solid black', margin: '5vh', paddingTop: '5vh' }}>
      {error && <p>{error}</p>}
      <form onSubmit={handleSignup}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button style={{ border: '1px solid black', backgroundColor: 'grey', marginTop: '1vh' }} type="submit">Sign Up</button>
      </form>
    </div>
  </div>
  );
}

'use client';
import { useState } from 'react';
import axios from 'axios';
import { usePathname, useSearchParams, redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'


export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const searchParams = useSearchParams()

  const redirect_url = searchParams.get('redirect_url') || '/';
  const state = searchParams.get('state') || '';
  const clientId = searchParams.get('client_id') || '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {


      const response = await axios.post('/api/auth/login', { email, password, redirect_url, state });
      if (response.status === 200) {
        const { redirectUrl: serverRedirectUrl } = response.data;
        //   console.log('I have to redirect to: ', serverRedirectUrl)
        //   // Redirect to the URL provided by the server
        window.location.href = serverRedirectUrl;

        //   //Make a next redirect with the headers
        //   redirect(serverRedirectUrl);
      }
    } catch (error) {
      console.log(error);
      setError('Login failed');
    }
  }
  return (
    <div style={{ display: 'flex', margin: '1vh', justifyContent: 'center', minHeight: '100vh', }}>
      <div style={{ border: '1px solid black', margin: '5vh', paddingTop: '5vh' }}>
        {error && <p>{error}</p>}
        <form onSubmit={handleLogin}>
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
          <button style={{ border: '1px solid black', backgroundColor: 'grey', marginTop: '1vh' }} type="submit">Login</button>
        </form>
        <div >
          <button style={{ border: '1px solid black', backgroundColor: 'grey', marginTop: '1vh' }} onClick={() => router.push(`/signup?client_id=${clientId}&redirect_url=${redirect_url}&state=${state}`)}>Register</button>
        </div>
      </div>
    </div>
  );
}

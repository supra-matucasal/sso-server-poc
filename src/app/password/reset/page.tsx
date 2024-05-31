'use client';
import { useState } from 'react';
import axios from 'axios';
import { usePathname, useSearchParams, redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'


export default function PasswordReset() {
  const searchParams = useSearchParams()
  const router = useRouter()


  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const email = 'test@email.com'


  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {


      const response = await axios.post('/api/auth/password/reset', { password, token });
      if (response.status === 200) {
          console.log('Password reset done')
      }
    } catch (error) {
      console.log(error);
      setError('Password reset failed');
    }
  }
  return (
    <div style={{ display: 'flex', margin: '1vh', justifyContent: 'center', minHeight: '100vh', }}>
      <div style={{ border: '1px solid black', margin: '5vh', paddingTop: '5vh' }}>
        {error && <p>{error}</p>}
        <form onSubmit={handlePasswordReset}>
          <div>
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button style={{ border: '1px solid black', backgroundColor: 'grey', marginTop: '1vh' }} type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

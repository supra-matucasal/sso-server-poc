'use client';
import { useState } from 'react';
import axios from 'axios';
import { usePathname, useSearchParams, redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'


export default function PasswordResetRequest() {
  const searchParams = useSearchParams()
  const router = useRouter()


  const state = searchParams.get('state') || '';

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');


  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {


      const response = await axios.post('/api/auth/password/request', { email, state });
      if (response.status === 200) {
          console.log('Password reset request sent')
          router.push('/password/request/success')
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
        <form onSubmit={handleRequestPasswordReset}>
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
          <button style={{ border: '1px solid black', backgroundColor: 'grey', marginTop: '1vh' }} type="submit">Request Password Reset</button>
        </form>
      </div>
    </div>
  );
}

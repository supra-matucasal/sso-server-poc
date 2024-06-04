const directusAPI = process.env.NEXT_PUBLIC_DIRECTUS_API;

type DirectusResponseLogin = {
  access_token: string;
  refresh_token: string;
  expires: number;
}

async function login(email: string, password: string): Promise<DirectusResponseLogin> {
  try {
    const response = await fetch(`${directusAPI}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: email, password: password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      console.log('Data: ', data.data);
      return data.data;
    } else {
      throw new Error('Failed to login');
    }

  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}

async function signup(email: string, password: string): Promise<DirectusResponseLogin> {
  try {
    await fetch(`${directusAPI}/users/register`, {
      method: 'POST',
      body: JSON.stringify({ email: email, password: password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });


    const response = await login(email, password);
    console.log('Response after login:', response);
    return response;

  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }

}


async function me(accessToken: string) {
  try {
    const response = await fetch(`${directusAPI}/users/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.json();
  }
  catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}

async function logout(accessToken: string, refreshToken: string) {
  try {
    const response = await fetch(`${directusAPI}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });


    return response;
  }
  catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}


async function passwordResetRequest(email: string) {
  try {
    const resetUrl = process.env.AUTH_SSO_SERVER + '/password/reset';

    const response = await fetch(`${directusAPI}/auth/password/request`, {
      method: 'POST',
      body: JSON.stringify({ email: email, reset_url: resetUrl }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  }
  catch (error) {
    console.error('Error requesting password reset:', error);
    return false;
  }
}

async function resetPassword(password: string, token: string) {
  try {
    const response = await fetch(`${directusAPI}/auth/password/reset`, {
      method: 'POST',
      body: JSON.stringify({ password: password, token: token }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  }
  catch (error) {
    console.error('Error resetting password:', error);
    return false;
  }
}

async function refreshToken(refreshToken: string) {
  try {
    const response = await fetch(`${directusAPI}/auth/refresh`, {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken, mode: 'json' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      console.log('Data: ', data.data);
      return data.data;
    } else {
      throw new Error('Failed to refresh token');
    }
  }
  catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}


export {
  login,
  signup,
  me,
  logout,
  passwordResetRequest,
  resetPassword,
  refreshToken
}
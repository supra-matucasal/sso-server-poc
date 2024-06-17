import axios from 'axios';

const directusAPI = process.env.NEXT_PUBLIC_DIRECTUS_API;
const authToken = process.env.AUTH_TOKEN

type DirectusResponseLogin = {
  access_token: string;
  refresh_token: string;
  expires: number;
}

async function login(email: string, password: string): Promise<DirectusResponseLogin> {
  try {
    const response = await fetch(`${directusAPI}/auth/login`, {
      cache: 'no-store',
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
    console.error('Error loggin in:', error);
    throw error;
  }
}

async function signup(email: string, password: string) {
  try {
    const verificationUrl = process.env.AUTH_SSO_SERVER + '/api/auth/verify-email';

    console.log('Creating user...:', JSON.stringify({ email: email, password: password, verification_url: verificationUrl }))

    const response = await fetch(`${directusAPI}/users/register`, {
      cache: 'no-store',
      method: 'POST',
      body: JSON.stringify({ email: email, password: password, verification_url: verificationUrl }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('Error signin up token:', error);
    return { status: 400, error: error};
  }

}


async function me(accessToken: string) {
  try {
    const response = await fetch(`${directusAPI}/users/me`, {
      cache: 'no-store',
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
      cache: 'no-store',
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
      cache: 'no-store',
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
      cache: 'no-store',
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
      cache: 'no-store',
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


async function getApplicationByClientId(clientId: string) {
  try {
    console.log('authToken: ', authToken)
    console.log('Checking if client exists with directusAPI:', clientId, directusAPI)
    const response = await fetch(`${directusAPI}/items/applications?filter[client_id][_eq]=${clientId}`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    },);
    const result = await response.json();
    if (response.status === 200 && result.data.length > 0) {
      console.log('result.data[0]: ', result.data[0])
      return result.data[0];
    }
    return false;
  } catch (error) {
    console.error('Error verifying client:', error);
    return false;
  }
}

async function isRedirectUrlValid(clientId: string, redirectUrl: string) {
  const client = await getApplicationByClientId(clientId);
  console.log('client: ', client)
  if (client && client.allowed_callback_urls) {
    console.log('Checking if redirect is allowed: ', redirectUrl)
    console.log('client.allowed_callback_urls: ', client.allowed_callback_urls)
    const allowedUrls = client.allowed_callback_urls.split(',').map((url: string) => url.trim());
    console.log('Allowed urls:', allowedUrls)
    return allowedUrls.includes(redirectUrl);
  }
  return false;
}

async function isClientSecretValid(clientId: string, clientSecret: string) {
  const client = await getApplicationByClientId(clientId);
  console.log('Comparing client secret:', client.client_secret, clientSecret)
  if (client && client.client_secret) {
    return client.client_secret === clientSecret;
  }
  return false;
}


//Had to use axios because fetch was not working properly
async function checkUserExists(email: string) {

  const data = JSON.stringify({
    "query": {
      "filter": {
        "email": {
          "_eq": email
        }
      }
    }
  });
  
  const config = {
    method: 'search',
    url: `${directusAPI}/users`,
    headers: { 
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    data : data
  };

  try {
    const response = await axios(config)

    if (response.data.data.length > 0) {
      return true;
    }
    return false;
  }
  catch (error) {
    console.error('Error verifying user:', error);
    return false;
  }

}


async function verifyEmail (token: string) {
  try {
    const response = await fetch(`${directusAPI}/users/register/verify-email?token=${token}`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  }
  catch (error) {
    console.error('Error verifying token:', error);
    return { status: 400 };
  }
}

export {
  login,
  signup,
  me,
  logout,
  passwordResetRequest,
  resetPassword,
  refreshToken,
  getApplicationByClientId,
  isRedirectUrlValid,
  isClientSecretValid,
  checkUserExists,
  verifyEmail
}
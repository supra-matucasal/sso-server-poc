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




export {
  login,
  me,
  logout
}
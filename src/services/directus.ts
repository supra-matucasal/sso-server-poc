const directusAPI = process.env.NEXT_PUBLIC_DIRECTUS_API;

type DirectusResponseLogin = {
  access_token: string;
  refresh_token: string;
  expires: number;
}

async function login(email: string, password: string): Promise<DirectusResponseLogin> {
  try {
    console.log('Trying to login with this: ',  email, password)
    console.log('To this urL: ', `${directusAPI}/auth/login`)
    console.log('Doing login with this body: ', JSON.stringify({ email: email, password: password }))
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


async function me (accessToken: string) {
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



export {
  login,
  me
}
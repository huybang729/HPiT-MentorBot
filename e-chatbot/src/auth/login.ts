const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const loginUser = async (username: string, password : string) => {
  console.log(`${BASE_URL}/users/login`)
  const response = await fetch(`${BASE_URL}/users/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Login failed');
  console.log(response)
  return await response.json();
};

export const registerUser = async (userData:object) => {
  console.log(userData)
  const response = await fetch(`${BASE_URL}/users/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  console.log(response.status)
  // if (!response.ok) throw new Error((await response.json()).message || 'Registration failed');
  if(response.status === 409){
    throw new Error("Tài khoản hoặc Gmail đã có người sử dụng");
    return;
  }else if(response.status === 500){
    throw new Error("Không thể tạo tài khoản");
    return 
  }
  console.log("Check")
  return await response.json();
};

export const guestUser = async (userData:object) => {
  const response = await fetch(`${BASE_URL}/users/guest/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if(response.status === 409){
    throw new Error("Tài khoản hoặc Gmail đã có người sử dụng");
    return;
  }else if(response.status === 500){
    throw new Error("Không thể tạo tài khoản");
    return 
  }
  console.log("Check")
  return await response.json();
};
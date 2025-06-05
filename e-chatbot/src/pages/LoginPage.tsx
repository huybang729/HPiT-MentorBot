import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { InputBox } from '../components/InputBox';
import { faUser, faLock, faRightToBracket} from '@fortawesome/free-solid-svg-icons';
import { guestUser, loginUser } from '../auth/login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false)

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      setError('');
      const userData = await loginUser(username, password);
      localStorage.setItem('vlUser', JSON.stringify(userData));
      localStorage.setItem('x-user-key', userData.token);
      alert("Đăng nhập thành công");
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    }
  }

  const handleChatWithoutLogin = async () => {
    try {
      const res = await guestUser({ username: "guest" })
      const dummyData = {
        _id: res.userId,
        username: "Guest",
        imageUrl: "",
        gmail: "Tài khoản khách"
      }
      localStorage.setItem('vlUser', JSON.stringify(dummyData));
      localStorage.setItem('x-user-key', res.token);
      alert("Tiếp tục với tài khoản khách!");
      navigate("/")
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    const isLogin = localStorage.getItem('vlUser');
    if (isLogin) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className='bg-gray-800 h-screen w-screen flex items-center justify-center'>
      <div className='flex items-center justify-center w-2/3 h-4/5 bg-white rounded-2xl'>
        <div className="w-1/2 h-full flex items-center justify-center">
          <img src="./src/assets/logo.jpg" className="max-w-full max-h-full object-contain" alt="Logo" />
        </div>
        <div className="flex flex-col items-center justify-center w-1/2 h-full bg-amber-50 gap-5 rounded-r-2xl">
          <h1 className='text-4xl mb-5 font-bold'>Đăng nhập</h1>
          <h4 className={`text-red-700 text-xl font-semibold ${!error ? 'hidden' : ''}`}>{error}</h4>

          <InputBox icon={faUser} type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} />
          <InputBox icon={faLock} type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className='flex items-center justify-center'>
            {/* <input
              type="checkbox"
              className='w-4 h-4 accent-blue-600 cursor-pointer'
              id="rememberMe"
onChange={e => setRemember(e.target.checked)} // <-- sửa ở đây
            />
            <label htmlFor="rememberMe" className='ml-2 cursor-pointer'>
              Ghi nhớ tài khoản
            </label> */}
          </div>
          <div className='w-2/3 h-12'>
            <button onClick={handleLogin} className="w-3/4 h-12 mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-bl-2xl rounded-tl-2xl shadow-md transition duration-200">
              Đăng nhập
            </button>
            <button onClick={() => { navigate("/register") }} className="w-1/4 h-12 mt-5 bg-blue-300 hover:bg-blue-700 text-white font-semibold rounded-tr-2xl rounded-br-2xl shadow-md transition duration-200">
              Đăng ký
            </button>
          </div>
          <div>
            <p className='text-gray-500 text-xl mt-5'>
              Tiếp tục mà không có tài khoản?
              <FontAwesomeIcon icon={faRightToBracket} onClick={handleChatWithoutLogin} className='text-3xl hover:text-blue-700 ml-4 text-blue-400' />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
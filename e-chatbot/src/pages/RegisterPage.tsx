import React, { useEffect, useState } from 'react';
import { InputBox } from '../components/InputBox';
import { faUser, faLock, faEnvelope, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { registerUser } from '../auth/login';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [gmail, setGmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async () => {
        if (!username || !password || !gmail) {
            setError('Nhập thiếu thông tin');
            return;
        }

        if (password != repassword) {
            setError('Mật khẩu không trùng khớp')
            return
        }
        setError('');
        setSuccess('');

        try {
            await registerUser({ username, password, gmail, imageUrl: "" })
            setSuccess('Đăng ký thành công!');
            setUsername('');
            setPassword('');
            setGmail('');
            navigate("/login")
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        localStorage.removeItem("vlUser")
    },);

    return (
        <div className='bg-gray-800 h-screen w-screen flex items-center justify-center'>
            <div className='flex items-center justify-center w-2/3 h-4/5 bg-white rounded-2xl'>
                <div className="w-1/2 h-full flex items-center justify-center">
                    <img src="./src/assets/logo.jpg" className="max-w-full max-h-full object-contain" alt="Logo" />
                </div>
                <div className="flex flex-col items-center justify-center w-1/2 h-full bg-amber-50 gap-5 rounded-r-2xl">
                    <h1 className='text-4xl mb-5 font-bold'>Đăng ký</h1>
                    <h4 className={`text-red-700 text-xl font-semibold ${!error ? 'hidden' : ''}`}>{error}</h4>

                    <InputBox icon={faUser} type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <InputBox icon={faEnvelope} type="email" placeholder="Email" value={gmail} onChange={(e) => setGmail(e.target.value)} />
                    <InputBox icon={faLock} type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <InputBox icon={faCheckCircle} type="password" placeholder="Nhập lại mật khẩu" value={repassword} onChange={(e) => setRepassword(e.target.value)} />
                    {/* <div className='flex items-center justify-center'>
                        <input
                            type="checkbox"
                            className='w-4 h-4 accent-blue-600 cursor-pointer'
                            id="rememberMe"
                        />
                        <label htmlFor="rememberMe" className='ml-2 cursor-pointer'>
                            Ghi nhớ tài khoản
                        </label>
                    </div> */}
                    <div className='w-2/3 h-12'>
                        <button onClick={() => { navigate("/login") }} className="w-1/3 h-12 mt-5 bg-blue-200 hover:bg-blue-700 text-white font-semibold rounded-bl-2xl rounded-tl-2xl shadow-md transition duration-200">
                            Đăng nhập
                        </button>
                        <button onClick={handleRegister} className="w-2/3 h-12 mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-tr-2xl rounded-br-2xl shadow-md transition duration-200">
                            Đăng ký
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
import React, { useState } from 'react';
import { Form, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../redux/alertsSlice';
import '../resources/auth.css';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleFailedLogin = () => {
    setFailedAttempts((prevAttempts) => prevAttempts + 1);

    // Implement account lockout logic after a specified number of failed attempts
    const maxAttempts = 5;

    if (failedAttempts >= maxAttempts) {
      // You might want to disable the login form or introduce a delay before allowing further attempts
      message.error(`Account locked due to too many failed login attempts. Please try again later.`);
    }
  };
//On Finish
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post('/api/users/login', values);
      dispatch(HideLoading());

      if (response.data.success) {
        message.success(response.data.message);
        localStorage.setItem('token', response.data.data);
        navigate('/');
      } else {
        // Handle failed login
        handleFailedLogin();
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div className='h-screen d-flex justify-content-center align-items-center'>
      <div className='w-400 card p-3'>
        <h1 className='text-lg'> Login</h1>
        <hr />
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item label='Email' name='email'>
            <input type='text' />
          </Form.Item>
          <Form.Item label='Password' name='password'>
            <input type='password' />
          </Form.Item>
          <div className='d-flex justify-content-between align-items-center'>
            <Link to='/Register'>Click Here to Register</Link>
            <button className='secondary-btn' type='submit'>
              LogIn
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;

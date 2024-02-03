import React from 'react'
import { Form, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../redux/alertsSlice'

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validatePassword = (password) => {
    // Password length between 8 to 12 characters
    const lengthRegex = /^.{8,12}$/;

    // Password complexity requirements
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      lengthRegex.test(password) &&
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password) &&
      numberRegex.test(password) &&
      specialCharRegex.test(password)
    );
  };

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());

      // Check if the password meets the complexity requirements
      if (!validatePassword(values.password)) {
        dispatch(HideLoading());
        return message.error(
          'Password must be 8 to 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
        );
      }

      const response = await axios.post('/api/users/register', values);
      console.log(values);

      dispatch(HideLoading());

      if (response.data.success) {
        message.success(response.data.message);
        navigate('/login');
      } else {
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
        <h1 className='text-lg'> Register</h1>
        <hr />
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item label='Name' name='name'>
            <input type='text' />
          </Form.Item>
          <Form.Item label='Email' name='email'>
            <input type='text' />
          </Form.Item>
          <Form.Item label='Password' name='password'>
            <input type='password' />
          </Form.Item>
          <div className='d-flex justify-content-between align-items-center'>
            <Link to='/Login'>Click Here to Login</Link>
            <button className='secondary-btn' type='submit'>
              Register
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;

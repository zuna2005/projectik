import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ValidateLogin from './LoginValidation'

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({})
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(ValidateLogin(values));
    }
  return (
    <div className="row justify-content-center align-items-center min-vh-100 bg-dark">
        <div className='bg-light p-3 rounded w-50'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor='login-email' class="form-label">Email</label>
                    <input id='login-email' type='email' class="form-control" name='email' onChange={handleInput} placeholder='Enter your email'/>
                    <span className='text-danger'>{errors.email}</span>
                </div>
                <div className='mb-3'>
                    <label htmlFor='login-password' class="form-label">Password</label>
                    <input id='login-password' type='password' class="form-control" name='password' onChange={handleInput} placeholder='Enter your password'/>
                    <span className='text-danger'>{errors.password}</span>
                </div>
                <div class="d-flex justify-content-between">
                    <button type='submit' className='btn btn-success'>Login</button>
                    <Link to='/signup' type='button' className='btn btn-secondary'>Create Account</Link>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login
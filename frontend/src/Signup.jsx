import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <div className="row justify-content-center align-items-center min-vh-100 bg-dark">
        <div className='bg-light p-3 rounded w-50'>
        <h2>Sign up</h2>
            <form>
                <div className='mb-3'>
                    <label htmlFor='signup-name' class="form-label">Name</label>
                    <input id='signup-name' type='text' class="form-control" placeholder='Enter your name'/>
                </div>
                <div className='mb-3'>
                    <label htmlFor='signup-email' class="form-label">Email</label>
                    <input id='signup-email' type='email' class="form-control" placeholder='Enter your email'/>
                </div>
                <div className='mb-3'>
                    <label htmlFor='signup-password' class="form-label">Password</label>
                    <input id='signup-password' type='password' class="form-control" placeholder='Enter your password'/>
                </div>
                <div class="d-flex justify-content-between">
                    <button type='button' className='btn btn-success'>Sign up</button>
                    <Link to='/' type='button' className='btn btn-secondary'>Log in</Link>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Signup
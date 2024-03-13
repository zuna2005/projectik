import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import ValidateLogin from '../LoginValidation'
import FormField from './FormField'
import { useAppContext } from '../AppContext'
import {setUser} from "../features/login/loginSlice"
import changeUserState from '../UpdateUser'

const Form = ({heading}) => {
    // const {user, changeUserState, setUser} = useAppContext();

    const dispatch = useDispatch()
    const user = useSelector(state => state.login.currentUser)

    let messageText = ''
    if (user.status === 'Blocked') {
        messageText = "You're blocked and can no longer log into the system"
    }
    else if (user.status === 'Deleted') {
        messageText = "You were deleted from the system. You can re-register if you wish to"
    }
    const [message, setMessage] = useState({
        text: messageText,
        type: 'danger'
    })
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({})
    const navigate = useNavigate();
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        let errorsTemp = ValidateLogin(values)
        setErrors(errorsTemp)
        if (heading === 'Sign up' && Object.values(errorsTemp).every(value => value === '')) {
            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/users/signup`, values)
            .then(res => {
                console.log(res)
                if (res.data === 'Email exists') {
                    setMessage(prev => ({...prev, text:'User with this email already exists. Maybe try login?'}))
                } else {
                    console.log('Successful sign up')
                    setMessage(prev => ({...prev, text:'Successful sign up. Now log into the system', type:'success'}))
                    navigate('/login')
                }
            })
            .catch(err => console.log(err))
        }
        else if (heading === 'Login' && Object.values(errorsTemp).slice(1).every(value => value === '')) {
            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/users/login`, values)
            .then(res => {
                console.log(res.data)
                if (res.data === 'Success') {
                    //changeUserState(values)
                    dispatch(setUser(changeUserState(values)))
                    navigate('/')
                    if (user.status === 'Blocked') {
                        setMessage(prev => ({...prev, text:"You're blocked and can no longer log into the system"}))
                    }
                } else if (res.data === 'Incorrect password') {
                    setMessage(prev => ({...prev, text: res.data}))
                } else if (res.data === 'Incorrect email') {
                    setMessage(prev => ({...prev, text:'User not found'}))
                }
                
            })
            .catch(err => console.log(err))
        }
        if (!Object.values(errorsTemp).every(value => value === '')) {        
            setMessage(prev => ({...prev, text:''}))
        }
    }
  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-dark">
        {message.text && <div className={`alert alert-${message.type} w-50`} role="alert">{message.text}</div>}
        <div className='bg-light p-3 rounded w-50'>
            <h2>{heading}</h2>
            <form onSubmit={handleSubmit}>
                {heading === 'Sign up' && 
                <FormField name='name' onChange={handleInput} errors={errors} />}
                <FormField name='email' onChange={handleInput} errors={errors} />
                <FormField name='password' onChange={handleInput} errors={errors} />
                <div className="d-flex justify-content-between">
                    <button type='submit' className='btn btn-success'>{heading}</button>
                    <Link to={heading === 'Login' ? '/signup' : '/login'} type='button' className='btn btn-secondary'>
                        {heading === 'Login' ? 'Sign up' : 'Login'}
                    </Link>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Form
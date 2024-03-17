import React, { useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import ValidateLogin from '../LoginValidation'
import FormField from './FormField'
import {setUser} from "../features/loginSlice"

const Form = ({heading}) => {
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

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('you pressed the green button')
        let errorsTemp = ValidateLogin(values)
        setErrors(errorsTemp)
        if (heading === 'Sign up' && Object.values(errorsTemp).every(value => value === '')) {
            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/users/signup`, values)
            .then(res => {
                console.log(res)
                if (res.data === 'Email exists') {
                    setMessage(prev => ({...prev, text:'User with this email already exists. Maybe try login?'}))
                } else {
                    dispatch(setUser({...res.data}))
                    document.getElementById('signupModal').classList.remove('show')
                    document.getElementsByClassName('modal-backdrop')[0].remove();
                }
            })
            .catch(err => console.log(err))
        }
        else if (heading === 'Login' && Object.values(errorsTemp).slice(1).every(value => value === '')) {
            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/users/login`, values)
            .then(res => {
                console.log(res.data)
                dispatch(setUser({...res.data}))
                document.getElementById('loginModal').classList.remove('show')
                document.getElementsByClassName('modal-backdrop')[0].remove();
                if (user.status === 'Blocked') {
                    setMessage(prev => ({...prev, text:"You're blocked and can no longer log into the system"}))
                }
                
            })
            .catch(err => {
                console.log(err);
                if (err.response.data === 'Incorrect password') {
                    setMessage(prev => ({...prev, text: err.response.data}))
                } else if (err.response.data === 'Incorrect email') {
                    setMessage(prev => ({...prev, text:'User not found'}))
                }
            })
        }
        if (!Object.values(errorsTemp).every(value => value === '')) {        
            setMessage(prev => ({...prev, text:''}))
        }
    }
    const handleClear = () => {
        setValues({ name: '', email: '', password: '' })
        setErrors({})
        setMessage({})
    }
  return (
    <div className="modal fade" id={heading === 'Login' ? 'loginModal' : 'signupModal'} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{heading}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            {message.text && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}
                <form>
                    {heading === 'Sign up' && 
                    <FormField name='name' onChange={handleInput} errors={errors} />}
                    <FormField name='email' onChange={handleInput} errors={errors} />
                    <FormField name='password' onChange={handleInput} errors={errors} />
                </form>
                <div className="d-flex justify-content-between">
                        <button type='submit' className='btn btn-success' onClick={handleSubmit}>{heading}</button>
                        <button className='btn btn-secondary'
                            data-bs-target={heading === 'Login' ? '#signupModal' : '#loginModal'} data-bs-toggle="modal">
                            {heading === 'Login' ? 'Sign up' : 'Login'}
                        </button>
                    </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Form
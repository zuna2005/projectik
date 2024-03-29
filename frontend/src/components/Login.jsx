import React, { useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import ValidateLogin from '../helpers/LoginValidation'
import FormField from './FormField'
import {setUser} from "../features/loginSlice"

const Form = ({heading}) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.login.currentUser)
    const [t, i18n] = useTranslation()

    const [message, setMessage] = useState({
        text: '',
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
        let errorsTemp = ValidateLogin(values)
        setErrors(errorsTemp)
        if (heading === t('signUp') && Object.values(errorsTemp).every(value => value === '')) {
            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/users/signup`, values)
            .then(res => {
                console.log(res)
                if (res.data === 'Email exists') {
                    setMessage(prev => ({...prev, text: t('emailExistsMessage')}))
                } else {
                    dispatch(setUser({...res.data}))
                    document.getElementById('signupModal').classList.remove('show')
                    document.getElementsByClassName('modal-backdrop')[0].remove()
                    setMessage(prev => ({...prev, text:""}))
                }
            })
            .catch(err => console.log(err))
        }
        else if (heading === t('login') && Object.values(errorsTemp).slice(1).every(value => value === '')) {
            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/users/login`, values)
            .then(res => {
                console.log(res.data)
                if (res.data.status === 'Blocked') {
                    setMessage(prev => ({...prev, text:t('blockedMessage')}))
                }
                else {
                    dispatch(setUser({...res.data}))
                    document.getElementById('loginModal').classList.remove('show')
                    document.getElementsByClassName('modal-backdrop')[0].remove()
                    setMessage(prev => ({...prev, text:""}))
                }               
                
            })
            .catch(err => {
                console.log(err);
                if (err.response.data === 'Incorrect password') {
                    setMessage(prev => ({...prev, text: t('incorrectPassword')}))
                } else if (err.response.data === 'Incorrect email') {
                    setMessage(prev => ({...prev, text: t('userNotFound')}))
                }
            })
        }
        if (!Object.values(errorsTemp).every(value => value === '')) {        
            setMessage(prev => ({...prev, text:''}))
        }
    }
  return (
    <div className="modal fade" id={heading === t('login') ? 'loginModal' : 'signupModal'} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{heading}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setMessage(prev => ({...prev, text:""}))} />
            </div>
            <div className="modal-body">
            {message.text && <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>}
                <form onSubmit={handleSubmit}>
                    {heading === t('signUp') && 
                    <FormField name='name' onChange={handleInput} errors={errors} heading={heading}/>}
                    <FormField name='email' onChange={handleInput} errors={errors} heading={heading}/>
                    <FormField name='password' onChange={handleInput} errors={errors} heading={heading}/>
                    <div className="d-flex justify-content-between">
                        <button type='submit' className='btn btn-success'>{heading}</button>
                        <button 
                            className='btn btn-secondary'
                            data-bs-target={heading === t('login') ? '#signupModal' : '#loginModal'} 
                            data-bs-toggle="modal"
                            onClick={(e) => {e.preventDefault(); setMessage(prev => ({...prev, text:""}))}}
                            >
                            {heading === t('login') ? t('signUp') : t('login')}
                        </button>
                    </div>
                </form>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Form
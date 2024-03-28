import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import updateUser from '../helpers/UpdateUser'
import { setUser } from "../features/loginSlice"
import New from '../assets/plus.svg'
import Trash from '../assets/trash.svg'

const NewCollection = () => {
    const user = useSelector(state => state.login.currentUser)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [customFields, setCustomFields] = useState({
        'Integer': 0,
        'String': 0,
        'Multiline Text': 0,
        'Boolean Checkbox': 0,
        'Date': 0
    })
    const [customNames, setCustomNames] = useState({
        'Integer': [],
        'String': [],
        'Multiline Text': [],
        'Boolean Checkbox': [],
        'Date': []
    })
    const [newField, setNewField] = useState('')
    const [newFieldName, setNewFieldName] = useState('')
    const [categories, setCategories] = useState([])

    useEffect(() =>{
        const getUpdUser = async () => {
            const updUser = await updateUser(user.id)
            console.log('updUser', updUser)
            dispatch(setUser(updUser))
        }
        getUpdUser()
        axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/categories`)
        .then(res => {
            setCategories(res.data)
        })
        .catch(err => console.log(err))
      }, [])
    const handleSubmit = async (event) => {
        event.preventDefault()
        const updUser = await updateUser(user.id)
        if (updUser.status === 'Active') {
            let formData = new FormData(event.target)
            let values = {}
            formData.append('user_id', user.id)
            for (let pair of formData.entries()) {
                values[pair[0]] = pair[1]
            }
            values['customNames'] = customNames

            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/create`, values)
            .then(res => {
            console.log(res.data)
            navigate('/my-page')
            })
            .catch(err => console.log(err))
        } else {
            dispatch(setUser(updUser))
        }
    }
    const handleCustomField = (event,val) => {
        event.preventDefault()
        setNewField(val)
    }
    const handleDeleteField = (event, fieldType, fieldName) => {
        event.preventDefault()
        setCustomFields(prev => ({...prev, [fieldType]: prev[fieldType] - 1}))
        setCustomNames(prev => ({...prev, [fieldType]: prev[fieldType].filter(val => val != fieldName)}))
    }
    const handleSaveNewField = (event) => {
        event.preventDefault()
        if (newFieldName != '') {
            setCustomFields(prev => ({...prev, [newField]: prev[newField] + 1}))
            setCustomNames(prev => ({...prev, [newField]: [...prev[newField], newFieldName]}))
            setNewField('')
            setNewFieldName('')
        }
    }
  return (
    <div className='d-flex flex-column align-items-center'>
        <div className='d-flex flex-column w-75 mt-4'>
            <h3>New Collection</h3>
            <form onSubmit={handleSubmit}>
                <div className='container'>
                    <div className='row'>
                        <div className='col'>
                            <label htmlFor="collection-name" className="form-label">Name</label>
                        </div>
                        <div className='col-6 w-75'>
                            <input type="text" className="form-control" id="collection-name" name='name' placeholder="My Collection" required />
                        </div>
                    </div>   
                    <div className='row mt-3'>
                        <div className='col'>
                            <label htmlFor="collection-description" className="form-label">Description</label>
                        </div>
                        <div className='col-6 w-75'>
                            <textarea className="form-control" id="collection-description" name='description' rows="3" placeholder="My Collection Description" required />
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col'>
                            <label htmlFor="category" className="form-label">Category</label>
                        </div>
                        <div className='col-6 w-75'>
                        <select className="form-select" name="category" required>
                            {categories.map( (val) => {
                                return(<option name={val.id} key={val.name}>{val.name}</option>)
                            })}
                        </select>
                        </div>
                    </div>
                    <div className='row mt-3 dropdown'>
                        <button className='btn btn-outline-dark' onClick={(e)=>e.preventDefault()}
                        data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={New} width={25} height={25}/> Add Custom Field for Items
                        </button>
                        <ul className="dropdown-menu">
                            {Object.keys(customFields).map(val => {
                                return (<li key={val}>
                                        <button className="dropdown-item" onClick={(e) => handleCustomField(e, val)} disabled={customFields[val] == 3}>
                                            {val} Field ({3 - customFields[val]} left)
                                        </button>
                                    </li>)
                            })}
                        </ul>
                    </div>
                    {newField != '' && <div className='row mt-3'>
                        <div className='col'>
                            <label htmlFor='newField' className="form-label">{`${newField} Field name`}</label>
                        </div>
                        <div className='col-6 w-75'>
                            <div className='d-flex flex-row'>
                                <input type="text" className="form-control" id="newField" name="newField"
                                placeholder="Enter name of the custom field" onChange={(e) => setNewFieldName(e.target.value)}required />
                                <button className='btn btn-outline-success ms-3' onClick={handleSaveNewField}>Save</button>
                            </div>
                        </div>
                    </div>}
                    <div>
                    {Object.keys(customFields).filter(val => customFields[val] != 0).map((val) => {
                        const getFields = () => {
                            const count = customFields[val];
                            const fields = [];
                            const values = Object.values(customNames[val])
                            for (let i = 1; i <= count; i++) {
                                fields.push(<div className='row mt-3'>
                                        <div className='col'>
                                            <label htmlFor={'id' + val + i} className="form-label">{`Field №${i} name`}</label>
                                        </div>
                                        <div className='col-6 w-75'>
                                            <div className='d-flex flex-row '>
                                                <input type="text" className="form-control" 
                                                id={'id' + val + i} name={val + i} value={values[i - 1] || ''}
                                                disabled />
                                                <button className='btn btn-outline-dark ms-3' onClick={(e) => handleDeleteField(e, val, values[i - 1])}>
                                                    <img src={Trash} width={25} height={25}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>)
                            }
                            return fields
                        }
                        return <div className='mt-3' key={val}>
                                <h5>{val} Fields</h5>
                                {getFields()}
                            </div>
                    })}
                    </div>
                </div>
                <div className='mt-4'>
                    <button type='submit' className='btn btn-outline-success me-3'>Create</button>
                    <Link to='/my-page' className='btn btn-outline-danger'>Cancel</Link>
                </div>
        </form>
        </div>
    </div>
  )
}

export default NewCollection
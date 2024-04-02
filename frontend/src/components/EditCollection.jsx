import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import axios from 'axios'
import New from '../assets/plus.svg'
import Trash from '../assets/trash.svg'
import Edit from '../assets/edit.svg'
import NewDark from '../assets/plus-dark.svg'
import TrashDark from '../assets/trash-dark.svg'
import EditDark from '../assets/edit-dark.svg'
import DeleteModal from './DeleteModal'
import fieldConvertApptoDb from '../helpers/fieldConvert'
import updateUser from '../helpers/UpdateUser'
import { setUser } from "../features/loginSlice"

const EditCollection = () => {
    const { coll_id } = useParams()
    const user = useSelector(state => state.login.currentUser)
    const darkMode = useSelector(state => state.mode.darkMode)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [t, i18n] = useTranslation()
    const isMobile = useMediaQuery({ query: '(max-width: 425px)' });

    const [custom, setCustom] = useState({
        'String': {'1': '', '2': '', '3': ''},
        'Integer': {'1': '', '2': '', '3': ''},
        'Multiline Text': {'1': '', '2': '', '3': ''},
        'Boolean Checkbox': {'1': '', '2': '', '3': ''},
        'Date': {'1': '', '2': '', '3': ''}
    })
    const [newField, setNewField] = useState('')
    const [newFieldName, setNewFieldName] = useState('')
    const [editField, setEditField] = useState('')
    const [editFieldName, setEditFieldName] = useState('')
    const [categories, setCategories] = useState([])
    const [collection, setCollection] = useState({})

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
        axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/getcollection`, {coll_id})
        .then(res => {
            const coll = res.data[0]
            setCollection(coll)
            console.log('collection', coll)
            const dbFields = ['string', 'int', 'text', 'checkbox', 'date'] 
            Object.keys(coll).filter(val => val.includes('state') && coll[val] == 1).map(val => {
                const fieldName = val.slice(0, val.indexOf('state')) + 'name'
                for (let dbField of dbFields) {
                    if (val.includes(dbField)) {
                        let index = val.indexOf(dbField) + dbField.length
                        let fieldIndex = val.slice(index, index + 1)
                        let appField = Object.keys(custom)[dbFields.indexOf(dbField)]
                        setCustom(prev => ({...prev, [appField]: {...prev[appField], [fieldIndex]: coll[fieldName]}}))
                        break;
                    }
                }
            })
        })
        .catch(err => console.log(err))
      }, [])
    const handleSubmit = async (event) => {
        event.preventDefault()
        const updUser = await updateUser(user.id)
        if (updUser.status === 'Active') {
            let formData = new FormData(event.target)
            let values = {}
            for (let pair of formData.entries()) {
                if (pair[0] == 'category') {
                    values['category_id'] = categories.find(val => val.name == pair[1]).id
                }
                else {
                    values[pair[0]] = pair[1]
                }
            }
            Object.keys(custom).map(fieldType => {
                Object.keys(custom[fieldType]).filter(ind => custom[fieldType][ind] != '').map(ind => {
                    values[fieldConvertApptoDb(fieldType, ind) + 'state'] = true
                    values[fieldConvertApptoDb(fieldType, ind) + 'name'] = custom[fieldType][ind]
                })
            })
            values['coll_id'] = coll_id
            console.log(values)

            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/update`, values)
            .then(res => {
            console.log(res.data)
            navigate(`/collection-page/${coll_id}`)
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
    const handleDeleteField = async (event, fieldType, fieldIndex) => {
        event.preventDefault()
        const updUser = await updateUser(user.id)
        if (updUser.status === 'Active') {
            console.log(custom)
            setCustom(prev => ({...prev, [fieldType]: {...prev[fieldType], [fieldIndex]: ''}}))
            let field = fieldConvertApptoDb(fieldType, fieldIndex)
            console.log(field)
            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/items/deleteCustomField`, {field, coll_id})
            .then(res => {
                console.log(res.data)
            })
            .catch(err => console.log(err))
            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/deleteCustomField`, {field, coll_id})
            .then(res => {
                console.log(res.data)
            })
            .catch(err => console.log(err))
        } else {
            dispatch(setUser(updUser))
        } 
    }
    const handleSaveNewField = (event) => {
        event.preventDefault()
        if (newFieldName != '') {
            for (let ind of Object.keys(custom[newField])) {
                if (custom[newField][ind] == '') {
                    setCustom(prev => ({...prev, [newField]: {...prev[newField], [ind]: newFieldName}}))
                    break
                }
            }
            setNewField('')
            setNewFieldName('')
        }
    }
    const handleSaveEditField = (event, fieldType, fieldIndex) => {
        event.preventDefault()
        if (editFieldName != '') {
            setCustom(prev => ({...prev, [fieldType]: {...prev[fieldType], [fieldIndex]: editFieldName}}))
            setEditField('')
            setEditFieldName('')
        }
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSaveNewField(e)
        }
    }
  return (
    <div className={`d-flex flex-column align-items-center min-vh-100 ${darkMode ? 'text-bg-dark' : 'bg-light'}`}>
        <div className='d-flex flex-column w-75 mt-4'>
            <h3 className='ms-2'>{t('Edit Collection')}</h3>
            <form onSubmit={handleSubmit}>
                <div className='container' data-bs-theme={darkMode && "dark"}>
                    <div className='row'>
                        <div className='col'>
                            <label htmlFor="collection-name" className="form-label">{t('itemName')}</label>
                        </div>
                        <div className={!isMobile && 'col-6 w-75'}>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="collection-name" 
                                name='name' 
                                placeholder={t('myCollection')} 
                                defaultValue={collection.name}
                                required />
                        </div>
                    </div>   
                    <div className='row mt-3'>
                        <div className='col'>
                            <label htmlFor="collection-description" className="form-label">{t('description')}</label>
                        </div>
                        <div className={!isMobile && 'col-6 w-75'}>
                            <textarea 
                                className="form-control" 
                                id="collection-description" 
                                name='description' 
                                rows="3" 
                                placeholder={t('myCollectionDescription')}
                                defaultValue={collection.description} 
                                required />
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col'>
                            <label htmlFor="category" className="form-label">{t('category')}</label>
                        </div>
                        <div className={!isMobile && 'col-6 w-75'}>
                        <select className="form-select" name="category" required>
                            {categories.map( (val) => {
                                return(<option name={val.id} key={val.name} selected={val.id == collection.category_id}>{val.name}</option>)
                            })}
                        </select>
                        </div>
                    </div>
                    <div className='row mt-3 dropdown'>
                    <button 
                            className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'} mx-2`} 
                            onClick={(e)=>e.preventDefault()}
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                            >
                            <img src={darkMode ? NewDark : New} width={25} height={25}/> {t('Add Custom Field for Items')}
                        </button>
                        <ul className="dropdown-menu">
                            {Object.keys(custom).map(val => {
                                return (<li key={val}>
                                        <button 
                                            className="dropdown-item" 
                                            onClick={(e) => handleCustomField(e, val)} 
                                            disabled={Object.keys(custom[val]).filter(ind => custom[val][ind] != '').length == 3}
                                            >
                                            {t(`customFields.${val}`)} ({3 - Object.keys(custom[val]).filter(ind => custom[val][ind] != '').length} {t('left')})
                                        </button>
                                    </li>)
                            })}
                        </ul>
                    </div>
                    {newField != '' && <div className='row mt-3'>
                        <div className='col'>
                            <label htmlFor='newField' className="form-label">{t('itemName')}</label>
                        </div>
                        <div className='col-6 w-75'>
                            <div className='d-flex flex-row'>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="newField" 
                                    name="newField"
                                    placeholder={t("Enter name of the custom field")} 
                                    onChange={(e) => setNewFieldName(e.target.value)} 
                                    onKeyDown={handleKeyPress}
                                    required />
                                <button className='btn btn-outline-success ms-3' onClick={handleSaveNewField}>{t('buttons.save')}</button>
                            </div>
                        </div>
                    </div>}
                    <div>
                    {Object.keys(custom).map((val) => {
                        const getFields = () => {
                            const fields = []
                            Object.keys(custom[val]).filter(key => custom[val][key] != '').map(key => {
                                fields.push(<div className='row mt-3'>
                                        <div className='col'>
                                            <label htmlFor={'id' + val + key} className="form-label">{`${isMobile ? '' : t('Name of Field')} №${key}`}</label>
                                        </div>
                                        <div className='col-6 w-75'>
                                            <div className='d-flex flex-row '>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id={'id' + val + key} 
                                                    name={val + key} 
                                                    value={editField === val + key ? editFieldName : custom[val][key]}
                                                    onChange={(e) => setEditFieldName(e.target.value)}
                                                    disabled={editField != val + key} />
                                                {editField == val + key ?
                                                <button className='btn btn-outline-success ms-3' onClick={(e) => handleSaveEditField(e, val, key)}>{t('buttons.save')}</button>
                                                : <div className='d-flex flex-row'>
                                                    <button className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'} ms-2`} onClick={() => setEditField(val + key)}>
                                                        <img src={darkMode ? EditDark : Edit} width={25} height={25}/>
                                                    </button>
                                                    <button 
                                                        className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'} ms-1`} 
                                                        data-bs-toggle="modal" 
                                                        data-bs-target="#deleteModal" 
                                                        onClick={(e) => e.preventDefault(e)}
                                                        >
                                                        <img src={darkMode ? TrashDark : Trash} width={25} height={25}/>
                                                    </button>
                                                    <DeleteModal onDeleteField={handleDeleteField} fieldType={val} fieldIndex={key}/>
                                                </div>}
                                            </div>
                                        </div>
                                    </div>)
                            })
                            return fields
                        }
                        return <div className='mt-3' key={val}>
                                {getFields() != '' && <h5>{t(`customFields.${val} Fields`)}</h5>}
                                {getFields()}
                            </div>
                    })}
                    </div>
                </div>
                <div className='my-4'>
                    <button type='submit' className='btn btn-outline-success me-3'>{t('buttons.save')}</button>
                    <Link to={`/collection-page/${coll_id}`} className='btn btn-outline-danger'>{t('buttons.cancel')}</Link>
                </div>
        </form>
        </div>
    </div>
  )
}

export default EditCollection
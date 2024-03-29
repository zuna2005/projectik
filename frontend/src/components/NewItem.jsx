import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import CreatableSelect from 'react-select/creatable'
import axios from 'axios'
import updateUser from '../helpers/UpdateUser'
import { setUser } from "../features/loginSlice"

const NewItem = () => {
    const user = useSelector(state => state.login.currentUser)
    const darkMode = useSelector(state => state.mode.darkMode)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    let { coll_id } = useParams()
    const [collection, setCollection] = useState({})
    const [selectedTags, setSelectedTags] = useState([])
    const [options, setOptions] = useState([])
    const [checkboxes, setCheckboxes] = useState({})
    useEffect(() =>{
        const getUpdUser = async () => {
            const updUser = await updateUser(user.id)
            console.log('updUser', updUser)
            dispatch(setUser(updUser))
          }
        getUpdUser()
        axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/tags/allTags`)
        .then(res => {
            const data = res.data.map(val => ({ value: val.id, label: val.name }));
            setOptions(data)
        })
        .catch(err => console.log(err))
        axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/getcollection`, {coll_id})
        .then(res => {
            const coll = res.data[0]
            setCollection(coll)
            Object.keys(coll).filter(val => val.includes('state') && coll[val] == 1 && val.includes('checkbox')).map(val => {
                const field = val.slice(0, val.indexOf('state'))
                setCheckboxes(prev => ({...prev, [field]: false}))
            })
        })
        .catch(err => console.log(err))
      }, [])
    const handleTagChange = (selectedOption) => {
        setSelectedTags(selectedOption)
    }
    const handleCheckboxChange = (event) => {
        setCheckboxes(prev => ({...prev, [event.target.name]: event.target.checked}))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const updUser = await updateUser(user.id)
        if (updUser.status === 'Active') {
            let tagsIds = [], newTags = []
            for (let tag of selectedTags) {
                if (tag.__isNew__) {
                    newTags.push(tag.label)
                }
                else {
                    tagsIds.push(tag.value)
                }
            }
            if (newTags.length) {
                try {
                    const res = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/tags/create`, { newTags });
                    tagsIds = tagsIds.concat(res.data);
                } catch (error) {
                    console.error(error);
                }
            }
            console.log('ids of tags', tagsIds)

            let formData = new FormData(e.target)
            const itemData = {
                user_id: user.id,
                collection_id: coll_id,
                name: formData.get('name'),
                tags: tagsIds.join(',')
            }
            for (let pair of formData.entries()) {
                if (pair[0].includes('custom') && !pair[0].includes('checkbox')) {
                    itemData[pair[0] + 'state'] = true
                    itemData[pair[0] + 'value'] = pair[1] === '' ? null : pair[1]
                }
            }
            Object.keys(checkboxes).map(val => {
                itemData[val + 'state'] = true
                itemData[val + 'value'] = checkboxes[val]
            })
            console.log(itemData)
            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/items/create`, itemData)
            .then(res => {
                axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/items-count`, {coll_id, change: 1})
                .then(res => {
                navigate(`/collection-page/${coll_id}`)
                })
                .catch(err => console.log(err))
                })
            .catch(err => console.log(err))
        } else {
            dispatch(setUser(updUser))
        } 
    }
    const darkTheme = {
        control: (styles) => ({
          ...styles,
          backgroundColor: '#212529',
          color: '#adb5bd',
          borderColor: '#343a40',
        }),
        option: (styles, { isSelected }) => ({
          ...styles,
          backgroundColor: isSelected ? '#555' : '#212529',
          color: isSelected ? '#adb5bd' : '#ccc',
          ':hover': {
            backgroundColor: '#6c757d', // Change to the desired hover color
          }
        }),
        multiValue: (styles) => ({
          ...styles,
          backgroundColor: '#666',
          color: '#fff',
        }),
      };
  return (
    <div className={`d-flex flex-column align-items-center min-vh-100 ${darkMode ? 'text-bg-dark' : 'bg-light'}`} data-bs-theme={darkMode && "dark"}>
        <div className='d-flex flex-column w-75 mt-4'>
            <h3>New Item</h3>
            <form onSubmit={handleSubmit}>
                <div className='container'>
                    <div className='row'>
                        <div className='col'>
                            <label htmlFor="item-name" className="form-label">Name</label>
                        </div>
                        <div className='col-6 w-75'>
                            <input type="text" className="form-control" id="item-name" name='name' placeholder="My Item" required />
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col'>
                            <label htmlFor="tags" className="form-label">Tags</label>
                        </div>
                        <div className='col-6 w-75'>
                            <CreatableSelect 
                                isMulti 
                                options={options} 
                                onChange={handleTagChange} 
                                styles={darkMode ? darkTheme : {}}
                                required/>
                        </div>
                    </div>
                    {Object.keys(collection).filter(val => val.includes('state') && collection[val] == 1).length > 0 &&
                    <div>
                        <hr />
                        <h5>Custom Fields</h5>
                    </div>}
                    {Object.keys(collection).filter(val => val.includes('state') && collection[val] == 1).map(val => {
                        const field = val.slice(0, val.indexOf('state'))
                        const fieldName = field + 'name'
                        const fieldType = () => {
                            if (val.includes('string')) {
                                return <input type="text" className="form-control" name={field} placeholder="String value" />
                            }
                            if (val.includes('int')) {
                                return <input type="number" className="form-control" name={field} placeholder="Integer value" />
                            }
                            if (val.includes('text')) {
                                return <textarea className="form-control" name={field} placeholder="Text value" />
                            }
                            if (val.includes('checkbox')) {
                                return <input type="checkbox" className="form-check-input" name={field} onChange={handleCheckboxChange}/>
                            }
                            if (val.includes('date')) {
                                return <input type="date" className="form-control form-control-date" name={field} />
                            }
                        }
                        return (
                        <div className='row mt-3'>
                            <div className='col'>
                                {collection[fieldName]}
                            </div>
                            <div className='col-6 w-75'>
                                {fieldType()}
                            </div>
                        </div>
                        )
                    })}
                <div className='mt-4'>
                    <button type='submit' className='btn btn-outline-success me-3'>Create</button>
                    <Link to={`/collection-page/${coll_id}`} className='btn btn-outline-danger'>Cancel</Link>
                </div>
                </div>
        </form>
        </div>
    </div>
  )
}

export default NewItem
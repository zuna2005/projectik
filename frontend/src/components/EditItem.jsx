import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import CreatableSelect from 'react-select/creatable'
import axios from 'axios'
import updateUser from '../helpers/UpdateUser'
import { setUser } from "../features/loginSlice"

const EditItem = () => {
    const user = useSelector(state => state.login.currentUser)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    let { item_id } = useParams()
    const [item, setItem] = useState({})
    const [collection, setCollection] = useState({})
    const [selectedTags, setSelectedTags] = useState([])
    const [defaultOptions, setDefaultOptions] = useState([])
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
            const opt = res.data.map(val => ({ value: val.id, label: val.name }))
            setOptions(opt)
            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/items/getById`, {item_id})
            .then(res => {
                const init_item = res.data[0]
                const defOpt = []
                setItem(init_item)
                init_item.tags.split(',').map(tag_id => {
                    defOpt.push(opt.find(val => val.value == tag_id))
                })
                setDefaultOptions(defOpt)
                axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/getcollection`, {coll_id: res.data[0].collection_id})
                .then(res => {
                    const coll = res.data[0]
                    setCollection(coll)
                    Object.keys(coll).filter(val => val.includes('state') && coll[val] == 1 && val.includes('checkbox')).map(val => {
                        const field = val.slice(0, val.indexOf('state'))
                        const value = init_item[field + 'value'] == 1 ? true : false
                        setCheckboxes(prev => ({...prev, [field]: value}))
                    })
                })
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
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
            if (!selectedTags.length) {
                tagsIds = defaultOptions.map(val => val.value)
            }
            console.log('ids of tags', tagsIds)

            let formData = new FormData(e.target)
            const itemData = {
                user_id: user.id,
                collection_id: collection.id,
                name: formData.get('name'),
                tags: tagsIds.join(','),
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
            itemData['item_id'] = item_id
            console.log(itemData)
            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/items/update`, itemData)
            .then(res => {
                navigate(`/item-page/${item_id}`)
                })
            .catch(err => console.log(err))
        } else {
            dispatch(setUser(updUser))
        }
    }
  return (
    <div className='d-flex flex-column align-items-center'>
        <div className='d-flex flex-column w-75 mt-4'>
            <h3>Edit Item</h3>
            <form onSubmit={handleSubmit}>
                <div className='container'>
                    <div className='row'>
                        <div className='col'>
                            <label htmlFor="item-name" className="form-label">Name</label>
                        </div>
                        <div className='col-6 w-75'>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="item-name" 
                                name='name' 
                                placeholder="My Item" 
                                defaultValue={item.name}
                                required />
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col'>
                            <label htmlFor="tags" className="form-label">Tags</label>
                        </div>
                        <div className='col-6 w-75'>
                        {defaultOptions.length > 0 && (
                        <CreatableSelect 
                            isMulti 
                            options={options} 
                            defaultValue={defaultOptions}
                            onChange={handleTagChange} 
                            required
                        />
                        )}
                        </div>
                    </div>
                    <hr />
                    <h5>Custom Fields</h5>
                    {Object.keys(collection).filter(val => val.includes('state') && collection[val] == 1).map(val => {
                        const field = val.slice(0, val.indexOf('state'))
                        const fieldName = field + 'name'
                        const fieldType = () => {
                            if (val.includes('string')) {
                                return <input 
                                    type="text" 
                                    className="form-control" 
                                    name={field} 
                                    defaultValue={item[field + 'value']} 
                                    placeholder="String value" />
                            }
                            if (val.includes('int')) {
                                return <input 
                                    type="number" 
                                    className="form-control" 
                                    name={field}
                                    defaultValue={item[field + 'value']} 
                                    placeholder="Integer value" />
                            }
                            if (val.includes('text')) {
                                return <textarea 
                                    className="form-control" 
                                    name={field} 
                                    defaultValue={item[field + 'value']}
                                    placeholder="Text value" />
                            }
                            if (val.includes('checkbox')) {
                                return <input 
                                    type="checkbox" 
                                    className="form-check-input" 
                                    name={field}
                                    onChange={handleCheckboxChange}
                                    defaultChecked = {item[field + 'value'] == 1}/>
                            }
                            if (val.includes('date')) {
                                return <input 
                                    type="date" 
                                    className="form-control form-control-date" 
                                    name={field} 
                                    defaultValue={item[field + 'value']} />
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
                    <button type='submit' className='btn btn-outline-success me-3'>Save</button>
                    <Link to={`/item-page/${item_id}`} className='btn btn-outline-danger'>Cancel</Link>
                </div>
                </div>
        </form>
        </div>
    </div>
  )
}

export default EditItem
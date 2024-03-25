import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
import CreatableSelect from 'react-select/creatable'
import axios from 'axios'
import New from '../assets/plus.svg'
import Trash from '../assets/trash.svg'

const NewItem = () => {
    const user = useSelector(state => state.login.currentUser)
    const navigate = useNavigate()
    let { coll_id } = useParams()
    const [selectedTags, setSelectedTags] = useState([])
    const [options, setOptions] = useState([])
    useEffect(() =>{
        axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/tags/allTags`)
        .then(res => {
            console.log(res.data)
            const data = res.data.map(val => ({ value: val.id, label: val.name }));
            setOptions(data)
        })
        .catch(err => console.log(err))
      }, [])
    const handleTagChange = (selectedOption) => {
        console.log('i chose', selectedOption)
        setSelectedTags(selectedOption)

    }
    const handleSubmit = async (e) => {
        e.preventDefault()
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
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1])
        }
        const itemData = {
            user_id: user.id,
            collection_id: coll_id,
            name: formData.get('name'),
            tags: tagsIds.join(',')
        }
        axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/items/create`, itemData)
        .then(res => {
            let item_id = res.data
            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/newItem`, {coll_id, item_id})
            .then(res => {
            navigate(`/collection-page/${coll_id}`)
            })
            .catch(err => console.log(err))
            })
        .catch(err => console.log(err))
    }
  return (
    <div className='d-flex flex-column align-items-center'>
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
                            <CreatableSelect isMulti options={options} onChange={handleTagChange}/>
                        </div>
                    </div>
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
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import fetchItemsAndTags from '../helpers/fetchItemsAndTags'
import updateUser from '../helpers/UpdateUser'
import { setUser } from "../features/loginSlice"
import Trash from '../assets/trash.svg'
import TrashDark from '../assets/trash-dark.svg'
import Edit from '../assets/edit.svg'
import EditDark from '../assets/edit-dark.svg'
import Back from '../assets/arrow-left.svg'
import BackDark from '../assets/arrow-left-dark.svg'
import HeartOutline from '../assets/heart-outline.svg'
import HeartOutlineDark from '../assets/heart-outline-dark.svg'
import HeartFill from '../assets/heart-fill.svg'

const ItemPage = () => {
  const { item_id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.login.currentUser)
  const darkMode = useSelector(state => state.mode.darkMode)

  const [item, setItem] = useState({})
  const [collection, setCollection] = useState({})
  const [liked, setLiked] = useState(false)
  useEffect(() =>{
    const getUpdUser = async () => {
      const updUser = await updateUser(user.id)
      console.log('updUser', updUser)
      dispatch(setUser(updUser))
    }
    user.status != '' && getUpdUser()
    axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/items/getById`, {item_id})
    .then(async res => {
      const itemsWithTags = await fetchItemsAndTags(res.data)
      setItem(itemsWithTags[0])
      setLiked(itemsWithTags[0].likes.includes(user.id))
      axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/getcollection`, {coll_id: itemsWithTags[0].collection_id})
      .then(res => {
          setCollection(res.data[0])
      })
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err)) 
  }, [])
  const handleLike = async () => {
    const updUser = await updateUser(user.id)
    if (updUser.status === 'Active') {
      setLiked(!liked)
      axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/items/like`, {item_id, user_id: user.id, like: !liked})
      .then(async res => {
        const itemsWithTags = await fetchItemsAndTags(res.data)
        setItem(itemsWithTags[0])
        console.log('item likes', itemsWithTags[0].likes)
      })
      .catch(err => console.log(err))
    } else {
      dispatch(setUser(updUser))
    }
  }
  const handleDelete = async () => {
    const updUser = await updateUser(user.id)
    if (updUser.status === 'Active') {
      axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/items/delete`, {ids: [item_id]})
      .then(res => {
        console.log(res.data)
        navigate('/my-page')
      })
      .catch(err => console.log(err))
      axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/items-count`, {coll_id: item.collection_id, change: -1})
      .then(res => {
        console.log(res.data)
      })
      .catch(err => console.log(err))
    } else {
      dispatch(setUser(updUser))
    }
  }
  return (
    <div className={`d-flex flex-column align-items-center min-vh-100 ${darkMode ? 'text-bg-dark' : 'bg-light'}`}>
      <div className='d-flex flex-column w-75'>
        <div className="text-center my-4 position-relative">
          <div className="position-absolute" style={{top: '0px', left: '0px'}}>
            <button className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`} onClick={() => navigate(-1)}>
              <img src={darkMode ? BackDark : Back} width={25} height={25}/> Back
            </button>
          </div>
          <h3 className="w-100 text-center" style={{right: '50%'}}>Item "{item.name}"</h3>
          {(user.id === item.user_id || user.admin == 1) &&
          <div className="position-absolute" style={{top: '0px', right: '0px'}}>
            <NavLink to='edit-item' className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'} me-2`}>
              <img src={darkMode ? EditDark : Edit} width={25} height={25}/> Edit
            </NavLink>
            <button className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`} onClick={handleDelete}>
              <img src={darkMode ? TrashDark : Trash} width={25} height={25}/> Delete
            </button>
          </div>}
        </div>
        <div className='container'>
          <div className='row'>
            <div className='col-6 w-75'>
              <h6 className={`text-body-${darkMode ? 'light' : 'secondary'}`}>#id {item.id}</h6>
              <h5><span className='lead'>of collection </span>"<u style={{ cursor: 'pointer' }} onClick={() => navigate(`/collection-page/${collection.id}`)}>{collection.name}</u>"</h5>
              <h5><span className='lead'>by </span>"<u style={{ cursor: 'pointer' }} onClick={() => navigate(`/user-page/${item.user_id}`)}>{collection.user_name}</u>"</h5>
              <h5 className={`text-body-${darkMode ? 'light' : 'secondary'}`}>Likes: {item.likes ? item.likes.split(',').length : 0} 
                {user.status == 'Active' && 
                <button className='btn' onClick={handleLike}>{liked ? 
                  <img src={HeartFill} width={25} height={25}/> :
                  <img src={darkMode ? HeartOutlineDark : HeartOutline} width={25} height={25}/>
                  }</button>}
              </h5>
              {Object.keys(item).filter(val => val.includes('state') && item[val] == 1).length > 0 && <hr />}
              {Object.keys(item).filter(val => val.includes('state') && item[val] == 1).map(val => {
                    let field = val.slice(0, val.indexOf('state'))
                    return (
                      <div className='row mt-3'>
                        <div className='col'>
                          <h5>{collection[field + 'name']}:</h5>
                        </div>
                        <div className='col'>
                          <h5 className='lead'>{item[field + 'value'] || '-'}</h5>
                        </div>
                      </div>
                    )
                  })}
            </div>
            <div className='col border-start'>
              <h4>Tags:</h4>
              {item.tags && item.tags.split(', ').map(tag => {
                return (
                  <button 
                  className={`btn me-3 mb-2 ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`} 
                  onClick={() => navigate(`/search?query=${encodeURIComponent(tag)}`)}
                  >
                    {tag} 
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <hr />
        <h4 >Comments</h4>
      </div>
    </div>
  )
}

export default ItemPage
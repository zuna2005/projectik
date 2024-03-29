import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import fetchItemsAndTags from '../helpers/fetchItemsAndTags'
import updateUser from '../helpers/UpdateUser'
import { setUser } from "../features/loginSlice"
import New from '../assets/plus.svg'
import Trash from '../assets/trash.svg'
import Edit from '../assets/edit.svg'
import Back from '../assets/arrow-left.svg'
import NewDark from '../assets/plus-dark.svg'
import TrashDark from '../assets/trash-dark.svg'
import EditDark from '../assets/edit-dark.svg'
import BackDark from '../assets/arrow-left-dark.svg'

const CollectionPage = () => {
  let { coll_id } = useParams()
  const user = useSelector(state => state.login.currentUser)
  const darkMode = useSelector(state => state.mode.darkMode)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [t, i18n] = useTranslation()

  const [collection, setCollection] = useState({})
  const [items, setItems] = useState([])
  useEffect(() =>{
    const getUpdUser = async () => {
      const updUser = await updateUser(user.id)
      console.log('updUser', updUser)
      dispatch(setUser(updUser))
    }
    user.status != '' && getUpdUser()
    axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/getcollection`, {coll_id})
    .then(res => {
        setCollection(res.data[0])
    })
    .catch(err => console.log(err))
    axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/items/getByColl`, { coll_id })
    .then(async res => {
      const itemsWithTags = await fetchItemsAndTags(res.data)
      setItems(itemsWithTags)
    })
    .catch(err => console.log(err))

  }, [])

  const [checkedItems, setCheckedItems] = useState({})
  const [allChecked, setAllChecked] = useState(false)

  const handleCheckboxChange = (event) => {
    setCheckedItems(prev => ({...prev, [event.target.name]: event.target.checked}));
    console.log(checkedItems)
    let updCheckedItems = {...checkedItems, [event.target.name]: event.target.checked}
    if (Object.values(updCheckedItems).length === items.length) {
      setAllChecked(Object.values(updCheckedItems).every(checked => checked === true))
    }
    else {setAllChecked(false)}
    console.log('updcheckeditems', Object.values(updCheckedItems))
    
  }
  const handleCheckboxChangeAll = (event) => {
    let result = {}
    setAllChecked(event.target.checked)
    for (let i in items) {
      result[items[i].id] = event.target.checked
    }
    setCheckedItems(result)
  }
  const handleDeleteCollection = async () => {
    const updUser = await updateUser(user.id)
    if (updUser.status === 'Active') {
      axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/delete`, {ids: [coll_id]})
      .then(res => {
        console.log(res)
        navigate('/my-page')
      })
      .catch(err => console.log(err))
      axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/items/deleteColl`, {ids: [coll_id]})
      .then(res => {
        console.log(res.data)
      })
      .catch(err => console.log(err))
    } else {
      dispatch(setUser(updUser))
    } 
  }
  const handleDeleteItems = async () => {
    const updUser = await updateUser(user.id)
    if (updUser.status === 'Active') {
      let data = {
        ids: [],
        coll_id
      }
      for (let id in checkedItems) {checkedItems[id] && data.ids.push(id)}
      console.log(data)
      if (data.ids.length) {
        axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/items/delete`, data)
        .then(async res => {
          const itemsWithTags = await fetchItemsAndTags(res.data)
          setItems(itemsWithTags)
        })
        .catch(err => console.log(err))
        axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/items-count`, {coll_id, change: (-1 * data.ids.length)})
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
      }
    } else {
      dispatch(setUser(updUser))
    } 
  } 
  const handleItemPage = (e, item_id) => {
    e.preventDefault()
    navigate(`/item-page/${item_id}`)
  }
  return (
    <div className={`d-flex flex-column align-items-center min-vh-100 ${darkMode ? 'text-bg-dark' : 'bg-light'}`} data-bs-theme={darkMode && "dark"}>
      <div className='d-flex flex-column w-75'>
        <div className="text-center my-4 position-relative">
          <div className="position-absolute" style={{top: '0px', left: '0px'}}>
            <button className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`} onClick={() => navigate(-1)}>
              <img src={darkMode ? BackDark : Back} width={25} height={25}/> {t('buttons.back')}
            </button>
          </div>
          <h3 className="w-100 text-center" style={{right: '50%'}}>{t('collection')} "{collection.name}"</h3>
          {(user.id === collection.user_id || user.admin == 1) &&
          <div className="position-absolute" style={{top: '0px', right: '0px'}}>
            <NavLink to='edit-collection' className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'} me-2`}>
              <img src={darkMode ? EditDark : Edit} width={25} height={25}/> {t('buttons.edit')}
            </NavLink>
            <button className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`} onClick={handleDeleteCollection}>
              <img src={darkMode ? TrashDark : Trash} width={25} height={25}/> {t('buttons.delete')}
            </button>
          </div>}
        </div>
        <div className='container'>
          <div className='row'>
            <div className='col'>
              <h5>{t('description')}:</h5>
            </div>
            <div className='col-6 w-75'>
              <h4 className='lead ms-3'>{collection.description}</h4>
            </div>
          </div>
          <div className='row mt-3'>
            <div className='col'>
              <h5>{t('category')}:</h5>
            </div>
            <div className='col-6 w-75'>
              <h4 className='lead ms-3'>{collection.category}</h4>
            </div>
          </div>
          <div className='row mt-3'>
            <div className='col'>
              <h5>{t('author')}:</h5>
            </div>
            <div className='col-6 w-75'>
              <h4 
                className='lead ms-3' 
                onClick={() => navigate(`/user-page/${collection.user_id}`)}
                style={{ cursor: 'pointer' }}
                >
                  <u>{collection.user_name}</u>
              </h4>
            </div>
          </div>
        </div>
        <hr />
        <div className='d-flex justify-content-center'>
          <h4>{t('items')}</h4>
        </div>
        {(user.id === collection.user_id || user.admin == 1) &&
        <div className='d-flex justify-content-between'>
          <NavLink to='new-item' className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'} me-2`}>
          <img src={darkMode ? NewDark : New} width={25} height={25}/> {t('buttons.new')}
          </NavLink>
          <button className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`} onClick={handleDeleteItems}>
          <img src={darkMode ? TrashDark : Trash} width={25} height={25}/> {t('buttons.delete')}
          </button>
        </div>}
        <table className='table table-hover mt-2'>
          <thead>
            <tr>
              {(user.id === collection.user_id || user.admin == 1) &&
              <th>
                <input 
                  className="form-check-input me-1" 
                  type="checkbox" 
                  checked={allChecked} 
                  onChange={handleCheckboxChangeAll}/>
              </th>}
              <th>Id</th>
              <th>{t('itemName')}</th>
              <th>{t('tags')}</th>
              {Object.keys(collection).filter(val => val.includes('state') && collection[val] == 1 && !val.includes('text')).map(val => {
                let fieldName = val.slice(0, val.indexOf('state')) + 'name'
                return (
                  <th>{collection[fieldName]}</th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              return (<tr key={item.id} onClick={(e) => handleItemPage(e, item.id)}>
                {(user.id === collection.user_id || user.admin == 1) &&
                <td>
                  <input 
                    type="checkbox"
                    name={item.id}
                    checked={checkedItems[item.id]}
                    onChange={handleCheckboxChange}
                    onClick={(e) => e.stopPropagation()}
                  />
                  </td>}
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.tags}</td>
                  {Object.keys(item).filter(val => val.includes('state') && item[val] == 1 && !val.includes('text')).map(val => {
                    let fieldName = val.slice(0, val.indexOf('state')) + 'value'
                    return (
                      <td>{fieldName.includes('checkbox') ? (item[fieldName] == 1 ? t('yes') : t('no')) : (item[fieldName] || '-')}</td>
                    )
                  })}
              </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CollectionPage
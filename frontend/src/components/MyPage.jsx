import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import updateUser from '../helpers/UpdateUser'
import { setUser } from "../features/loginSlice"
import New from '../assets/plus.svg'
import NewDark from '../assets/plus-dark.svg'
import Trash from '../assets/trash.svg'
import TrashDark from '../assets/trash-dark.svg'

const MyPage = () => {
  const user = useSelector(state => state.login.currentUser)
  const darkMode = useSelector(state => state.mode.darkMode)
  const { user_id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [t, i18n] = useTranslation()
  const [author, setAuthor] = useState('')
  const [data, setData] = useState([])
  useEffect(() =>{
    const getUpdUser = async () => {
      const updUser = await updateUser(user.id)
      console.log('updUser', updUser)
      dispatch(setUser(updUser))
    }
    user.status != '' && getUpdUser()
    axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/mycollections`, { user_id })
    .then(res => {
      setData(res.data)
    })
    .catch(err => console.log(err))
    axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/users/user`, { id: user_id })
    .then(res => {
      setAuthor(res.data[0])
    })
    .catch(err => console.log(err))
  }, [user_id])

  const [checkedItems, setCheckedItems] = useState({})
  const [allChecked, setAllChecked] = useState(false)

  const handleCheckboxChange = (event) => {
    setCheckedItems(prev => ({...prev, [event.target.name]: event.target.checked}));
    console.log(checkedItems)
    let updCheckedItems = {...checkedItems, [event.target.name]: event.target.checked}
    if (Object.values(updCheckedItems).length === data.length) {
      setAllChecked(Object.values(updCheckedItems).every(checked => checked === true))
    }
    else {setAllChecked(false)}
    console.log('updcheckeditems', Object.values(updCheckedItems))
    
  }
  const handleCheckboxChangeAll = (event) => {
    let result = {}
    setAllChecked(event.target.checked)
    for (let i in data) {
      result[data[i].id] = event.target.checked
    }
    setCheckedItems(result)
  }
  const handleDelete = async () => {
    const updUser = await updateUser(user.id)
    if (updUser.status === 'Active') {
      let data = {
        ids: [],
        user_id: user.id
      }
      for (let id in checkedItems) {checkedItems[id] && data.ids.push(id)}
      console.log(data)
      if (data.ids.length) {
        axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/delete`, data)
        .then(res => {
          console.log(res)
          setData(res.data)
        })
        .catch(err => console.log(err))
        axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/items/deleteColl`, data)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => console.log(err))
      }
    } else {
      dispatch(setUser(updUser))
    }    
  }
  const handleCollectionPage = (e, coll_id) => {
    e.preventDefault()
    navigate(`/collection-page/${coll_id}`)
  }
  return (
    <div className={`d-flex flex-column align-items-center min-vh-100 ${darkMode ? 'text-bg-dark' : 'bg-light'}`} data-bs-theme={darkMode && "dark"}>
      <div className='d-flex flex-column w-75'>
        <div className='d-flex justify-content-between my-4'>
        <h3>{t('collectionsOf')} "{author.name}" {user.id == user_id && `(${t('you')})`}</h3>
          {(user.id == user_id || user.admin == 1) &&
            <div>
            <NavLink to='new-collection' className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'} me-2`}>
            <img src={darkMode ? NewDark : New} width={25} height={25}/> {t('buttons.new')}
            </NavLink>
            <button className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`} onClick={handleDelete}>
            <img src={darkMode? TrashDark : Trash} width={25} height={25}/> {t('buttons.delete')}
            </button>
          </div>}
        </div>
        <table className='table table-hover'>
          <thead>
            <tr>
              {(user.id == user_id || user.admin == 1) && 
              <th >
                <input className="form-check-input" type="checkbox" checked={allChecked} onChange={handleCheckboxChangeAll}/>
              </th>}
              <th>{t('itemName')}</th>
              <th>{t('description')}</th>
              <th>{t('category')}</th>
              <th>{t('items')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val) => {
              return (
                <tr key={val.id} onClick={(e) => handleCollectionPage(e, val.id)}>
                  {(user.id == user_id || user.admin == 1) &&
                  <td>
                    <input 
                      type="checkbox"
                      name={val.id}
                      checked={checkedItems[val.id]}
                      onChange={handleCheckboxChange}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>}
                  <td>{val.collection_name}</td>
                  <td>{val.description}</td>
                  <td>{t(`categories.${val.category_name}`)}</td>
                  <td>{val.items_count}</td>
              </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyPage
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import Select from 'react-select'
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
import Sort from '../assets/sort.svg'
import Filter from '../assets/filter.svg'
import SortDark from '../assets/sort-dark.svg'
import FilterDark from '../assets/filter-dark.svg'

const CollectionPage = () => {
  let { coll_id } = useParams()
  const user = useSelector(state => state.login.currentUser)
  const darkMode = useSelector(state => state.mode.darkMode)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [t, i18n] = useTranslation()
  const isMobile = useMediaQuery({ query: '(max-width: 425px)' })

  const [collection, setCollection] = useState({})
  const [items, setItems] = useState([])
  const [displayedItems, setDisplayedItems] = useState([])
  const [tags, setTags] = useState([])
  const [checkedItems, setCheckedItems] = useState({})
  const [allChecked, setAllChecked] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [sortField, setSortField] = useState('id')
  const [sortOrder, setSortOrder] = useState('asc')
  const [sortOptions, setSortOptions] = useState([])

  useEffect(() =>{
    const getUpdUser = async () => {
      const updUser = await updateUser(user.id)
      console.log('updUser', updUser)
      dispatch(setUser(updUser))
    }
    user.status != '' && getUpdUser()
    axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/getcollection`, {coll_id})
    .then(res => {
      const coll = res.data[0]
      setCollection(coll)
      const customFields = Object.keys(coll).filter(val => val.includes('state') && coll[val] == 1 && !val.includes('text')).map(val => {
        const field = val.slice(0, val.indexOf('state'))
        return {label: coll[field + 'name'], value: field + 'value'}
      })
      setSortOptions([
        {label: 'Id', value: 'id'}, 
        {label: 'itemName', value: 'name'}, 
        {label: 'tags', value: 'tags'}, 
        ...customFields])
    })
    .catch(err => console.log(err))
    axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/items/getByColl`, { coll_id })
    .then(async res => {
      const itemsWithTags = await fetchItemsAndTags(res.data)
      setItems(itemsWithTags)
      setDisplayedItems(itemsWithTags)
    })
    .catch(err => console.log(err))
    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/tags/allTags`)
        .then(res => {
            const data = res.data.map(val => ({ value: val.id, label: val.name }));
            setTags(data)
        })
        .catch(err => console.log(err))
  }, [])

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
  const handleSort = (field, order) => {
    if (field.includes('int') || field.includes('checkbox') || field == 'id')
      setDisplayedItems(order == 'asc' ? displayedItems.sort((a, b) => a[field] - b[field]) : displayedItems.sort((a, b) => b[field] - a[field]))
    else
      setDisplayedItems(order == 'asc' ? displayedItems.sort((a, b) => a[field].localeCompare(b[field])) : displayedItems.sort((a, b) => b[field].localeCompare(a[field])))
    
  }
  const handleTagChange = (selectedOption) => {
    console.log(selectedOption)
    setSelectedTags(selectedOption)
  }
  const handleFilter = () => {
    if (selectedTags.length > 0) {
      const filteredItems = items.filter(item => {
        for (let tag of selectedTags) {
          if (item.tags.includes(tag.label))
            return true
        }
        return false})
      setDisplayedItems(filteredItems)
      handleSort()
    }
    console.log('filter')
  }
  const handleRemoveFilters = () => {
    setDisplayedItems(items)
    handleSort()
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
        backgroundColor: '#6c757d',
      }
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: '#666',
      color: '#fff',
    }),
  }
  return (
    <div className={`d-flex flex-column align-items-center min-vh-100 ${darkMode ? 'text-bg-dark' : 'bg-light'}`} data-bs-theme={darkMode && "dark"}>
      <div className='d-flex flex-column w-75'>
      <h3 className="text-center mt-4">{t('collection')} "{collection.name}"</h3>
        <div className="text-center mb-3 d-flex align-items-center justify-content-between">
          <button className={`btn d-flex ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`} onClick={() => navigate(`/user-page/${collection.user_id}`)}>
            <img src={darkMode ? BackDark : Back} width={25} height={25}/> {t('buttons.back')}
          </button>
          {(user.id === collection.user_id || user.admin == 1) &&
          <div>
            <NavLink to='edit-collection' className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'} me-2`}>
              <img src={darkMode ? EditDark : Edit} width={25} height={25}/> {!isMobile && t('buttons.edit')}
            </NavLink>
            <button className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`} onClick={handleDeleteCollection}>
              <img src={darkMode ? TrashDark : Trash} width={25} height={25}/> {!isMobile && t('buttons.delete')}
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
        <div className={`d-flex justify-content-${(user.id === collection.user_id || user.admin == 1) ? 'between' : 'end'}`}>
          {(user.id === collection.user_id || user.admin == 1) &&
          <div className='d-flex align-items-center flex-wrap'>
            <NavLink to='new-item' className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'} me-2`}>
              <img src={darkMode ? NewDark : New} width={25} height={25}/> {t('buttons.new')}
            </NavLink>
            <button className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`} onClick={handleDeleteItems}>
              <img src={darkMode ? TrashDark : Trash} width={25} height={25}/> {t('buttons.delete')}
            </button>
          </div>
          }
          <div className='d-flex flex-wrap'>
            <div className='dropdown'>
              <button 
                className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'} me-2`}
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                >
                  <img src={darkMode ? SortDark : Sort} width={25} height={25}/> {t('buttons.sort')}
              </button>
              <ul className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                {sortOptions.map(option => {
                  return (
                  <li 
                    className={`dropdown-item ${sortField === option.value && 'active'}`}
                    onClick={() => {setSortField(option.value); handleSort(option.value, sortOrder)}}
                    >
                      {t(option.label)}
                    </li>
                  )
                })}
                <li><hr class="dropdown-divider" /></li>
                <li><span class="dropdown-item-text">{t('order')}:</span></li>
                <li 
                  className={`dropdown-item ${sortOrder === 'asc' && 'active'}`}
                  onClick={() => {setSortOrder('asc'); handleSort(sortField, 'asc')}}
                  >
                    {t('ascending')}
                </li>
                <li 
                  className={`dropdown-item ${sortOrder === 'desc' && 'active'}`}
                  onClick={() => {setSortOrder('desc'); handleSort(sortField, 'desc')}}
                  >
                    {t('descending')}
                </li>
              </ul>
            </div>
            <button 
              className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`}
              data-bs-toggle="collapse" 
              data-bs-target="#collapseFilter" 
              aria-expanded="false" 
              aria-controls="collapseFilter"
            >
              <img src={darkMode ? FilterDark : Filter} width={25} height={25}/> {t('buttons.filter')}
            </button>
          </div>
          
        </div>
        <div className='position-relative'>
          <div className={`collapse mt-2 ${!isMobile && 'w-50'} position-absolute end-0`} id="collapseFilter">
            <div className="card card-body">
              <div className='row mt-1'>
                <div className='col'>
                  <h6>{t('byTags')}</h6>
                </div>
                <div className='col-6 w-75'>
                  <Select 
                    isMulti 
                    options={tags}
                    onChange={handleTagChange}
                    styles={darkMode ? darkTheme : {}}
                    placeholder={t('select')}
                  />
                </div>
              </div>
              <div className='d-flex justify-content-between mt-3'>
              <button className='btn btn-outline-success' onClick={handleFilter}>{t('toFilter')}</button>
              <button className='btn btn-outline-danger' onClick={handleRemoveFilters}>{t('removeFilters')}</button>
              </div>
            </div>
          </div>
        </div>
        <div className='w-100 overflow-scroll'>
        <table className='table table-hover mt-3'>
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
            {displayedItems.map((item) => {
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
    </div>
  )
}

export default CollectionPage
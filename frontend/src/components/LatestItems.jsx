import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const LatestItems = () => {
  const darkMode = useSelector(state => state.mode.darkMode)
  const navigate = useNavigate()
  const [t, i18n] = useTranslation()
  const [data, setData] = useState([])
  const fetchData = () => {
    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/items/getAll`)
      .then(res => {
        console.log(res.data)
        setData(res.data)
      })
      .catch(err => console.log(err))
  };
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])
  const handleItemPage = (e, item_id) => {
    e.preventDefault()
    navigate(`/item-page/${item_id}`)
  }
  return (
    <div className={`d-flex flex-column align-items-center ${darkMode ? 'text-bg-dark' : 'bg-light'}`} data-bs-theme={darkMode && "dark"}>
      <div className='d-flex flex-column w-75'>
        <h3 className='text-center mt-3'>{t('latestItems')}</h3>
        {data.map(val => {
          return (
            <div className='card mt-3' onClick={(e) => handleItemPage(e, val.id)}>
              <div className='card-body'>
              <h4 className="card-title">{t('item')} "{val.name}"</h4>
              <h6 className='card-subtitle'>{t('fromCollection')} "{val.collection_name}"</h6>
              <p className='card-text'>{t('by')} "{val.user_name}"</p>
              </div>
            </div>
          )
          
        })}
      </div>
    </div>
  )
}

export default LatestItems
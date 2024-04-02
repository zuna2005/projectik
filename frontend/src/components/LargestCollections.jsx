import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const LargestCollections = () => {
  const darkMode = useSelector(state => state.mode.darkMode)
  const navigate = useNavigate()
  const [t, i18n] = useTranslation()
  const [data, setData] = useState([])
  const fetchData = () => {
    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/top5`)
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
  const handleCollectionPage = (e, coll_id) => {
    e.preventDefault()
    navigate(`/collection-page/${coll_id}`)
  }
  return (
    <div className={`d-flex flex-column align-items-center min-vh-100 ${darkMode ? 'text-bg-dark' : 'bg-light'}`} data-bs-theme={darkMode && "dark"}>
      <div className='d-flex flex-column w-75'>
        <h3 className='text-center my-3'>{t('largestCollections')}</h3>
        <div className='w-100 overflow-scroll'>
        <table className='table table-hover'>
          <thead>
            <tr>
              <th>#</th>
              <th>{t('itemName')}</th>
              <th>{t('description')}</th>
              <th>{t('author')}</th>
              <th>{t('category')}</th>
              <th>{t('items')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val, ind) => {
              return (
                <tr key={val.id} onClick={(e) => handleCollectionPage(e, val.id)}>
                  <td>{ind + 1}</td>
                  <td>{val.name}</td>
                  <td>{val.description}</td>
                  <td>{val.user_name}</td>
                  <td>{t(`categories.${val.category_name}`)}</td>
                  <td>{val.items_count}</td>
              </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}

export default LargestCollections
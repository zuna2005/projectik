import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const Search = () => {
    const { search } = useLocation()
    const params = new URLSearchParams(search)
    const query = params.get('query')
    const darkMode = useSelector(state => state.mode.darkMode)
    const navigate = useNavigate()
    const [t, i18n] = useTranslation()
    const [items, setItems] = useState([])
    const [collections, setCollections] = useState([])
    useEffect(() => {
        axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/search`, {query})
        .then(res => {
            setCollections(res.data)
            console.log('collections search', res.data)
        })
        .catch(err => console.log(err))

        axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/items/search`, {query})
        .then(res => {
            setItems(res.data)
            console.log('items search', res.data)
        })
        .catch(err => console.log(err))
      }, [query])
  return (
    <div className={`d-flex flex-column align-items-center min-vh-100 ${darkMode ? 'text-bg-dark' : 'bg-light'}`} data-bs-theme={darkMode && "dark"}>
        <div className='d-flex flex-column w-75'>
        <h3 className='my-4'>{t('Search Results for')} {query.startsWith('#') && t('tag')} "{query}"</h3>
        {items.length != 0 && <h4>{t('items')}</h4>}
        {items.map(val => {
          return (
            <div className='card my-2' onClick={() => navigate(`/item-page/${val.id}`)}>
              <div className='card-body'>
              <h4 className="card-title">{t('item')} "{val.name}"</h4>
              <h6 className='card-subtitle'>{t('fromCollection')} "{val.collection_name}"</h6>
              <p className='card-text'>{t('by')} "{val.user_name}"</p>
              </div>
            </div>
          )
        })}
        {items.length != 0 && collections.length != 0 && <hr />}
        {collections.length != 0 && <h4 className='mt-2'>{t('collections')}</h4>}
        {collections.map(val => {
          return (
            <div className='card my-2' onClick={() => navigate(`/collection-page/${val.id}`)}>
              <div className='card-body'>
              <h4 className="card-title">{t('collection')} "{val.name}"</h4>
              <h6 className='card-subtitle'>{t('category')} "{val.category_name}"</h6>
              <p className='card-text'>{t('collectionBy')} "{val.user_name}"</p>
              </div>
            </div>
          )
        })}
        {items.length == 0 && collections.length == 0 && 
        <div>
            <h3>{t('Nothing found')} :(</h3>
            <h5 className='lead'>{t('Try searching something else')}</h5>
        </div>}
      </div>
    </div>
  )
}

export default Search
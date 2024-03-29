import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Search = () => {
    const { search } = useLocation()
    const params = new URLSearchParams(search)
    const query = params.get('query')
    const navigate = useNavigate()
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
    <div className='d-flex flex-column align-items-center'>
        <div className='d-flex flex-column w-75'>
        <h3 className='my-4'>Search Results for {query.startsWith('#') && 'tag'} "{query}"</h3>
        {items.length != 0 && <h4>Items</h4>}
        {items.map(val => {
          return (
            <div className='card my-2' onClick={() => navigate(`/item-page/${val.id}`)}>
              <div className='card-body'>
              <h4 className="card-title">Item "{val.name}"</h4>
              <h6 className='card-subtitle'>from collection "{val.collection_name}"</h6>
              <p className='card-text'>by "{val.user_name}"</p>
              </div>
            </div>
          )
        })}
        {items.length != 0 && collections.length != 0 && <hr />}
        {collections.length != 0 && <h4 className='mt-2'>Collections</h4>}
        {collections.map(val => {
          return (
            <div className='card my-2' onClick={() => navigate(`/collection-page/${val.id}`)}>
              <div className='card-body'>
              <h4 className="card-title">Collection "{val.name}"</h4>
              <h6 className='card-subtitle'>Category "{val.category_name}"</h6>
              <p className='card-text'>by "{val.user_name}"</p>
              </div>
            </div>
          )
        })}
        {items.length == 0 && collections.length == 0 && 
        <div>
            <h3>Nothing found :(</h3>
            <h5 className='lead'>Try searching something else</h5>
        </div>}
      </div>
    </div>
  )
}

export default Search
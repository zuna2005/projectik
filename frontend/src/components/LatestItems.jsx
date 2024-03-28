import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const LatestItems = () => {
  const navigate = useNavigate()
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
    <div className='d-flex flex-column align-items-center'>
      <div className='d-flex flex-column w-75'>
        <h3 className='text-center mt-3'>Latest Items</h3>
        {data.map(val => {
          return (
            <div className='card mt-3' onClick={(e) => handleItemPage(e, val.id)}>
              <div className='card-body'>
              <h4 className="card-title">Item "{val.name}"</h4>
              <h6 className='card-subtitle'>from collection "{val.collection_name}"</h6>
              <p className='card-text'>by "{val.user_name}"</p>
              </div>
            </div>
          )
          
        })}
      </div>
    </div>
  )
}

export default LatestItems
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LargestCollections = () => {
  const navigate = useNavigate()
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
    <div className='d-flex flex-column align-items-center'>
      <div className='d-flex flex-column w-75'>
        <h3 className='text-center mt-3'>Largest Collections</h3>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Author</th>
              <th>Category</th>
              <th>Items</th>
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
                  <td>{val.category_name}</td>
                  <td>{val.items_count}</td>
              </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LargestCollections
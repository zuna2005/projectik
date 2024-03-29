import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const TagCloud = () => {
  const [tags, setTags] = useState([])
  const navigate = useNavigate()
  useEffect(() =>{
    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/tags/allTags`)
    .then(res => {
        console.log(res.data)
        setTags(res.data)
    })
    .catch(err => console.log(err))
  }, [])
  return (
    <div className='d-flex flex-column align-items-center'>
      <div className='d-flex flex-column w-75'>
        <h3 className='text-center mt-3'>Tag Cloud</h3>
        <div className='d-flex flex-wrap'>
          {tags.map(tag => {
            return <button 
              className='btn btn-outline-dark me-3 mb-2' 
              onClick={() => navigate(`/search?query=${encodeURIComponent('#' + tag.name)}`)}
              >
                #{tag.name} 
              </button>
          })}
        </div>
      </div>
    </div>
  )
}

export default TagCloud
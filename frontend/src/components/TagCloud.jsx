import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const TagCloud = () => {
  const darkMode = useSelector(state => state.mode.darkMode)
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
    <div className={`d-flex flex-column align-items-center min-vh-100 ${darkMode ? 'text-bg-dark' : 'bg-light'}`}>
      <div className='d-flex flex-column w-75'>
        <h3 className='text-center mt-3'>Tag Cloud</h3>
        <div className='d-flex flex-wrap'>
          {tags.map(tag => {
            return <button 
              className={`btn me-3 mb-2 ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`} 
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
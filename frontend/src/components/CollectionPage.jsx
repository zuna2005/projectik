import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import New from '../assets/plus.svg'
import Trash from '../assets/trash.svg'
import Edit from '../assets/edit.svg'

const CollectionPage = () => {
  let { coll_id } = useParams()
  const user = useSelector(state => state.login.currentUser)
  const navigate = useNavigate()

  const [collection, setCollection] = useState({})
  const [data, setData] = useState([])
  useEffect(() =>{
    axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/getcollection`, {coll_id})
    .then(res => {
        setCollection(res.data[0])
        console.log(res.data[0])
    })
    .catch(err => console.log(err))
  }, [])

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
  const handleDeleteCollection = () => {
    axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/collections/delete`, {ids: [coll_id]})
      .then(res => {
        console.log(res)
        navigate('/my-page')
      })
      .catch(err => console.log(err))
  } 
  const handleItemPage = (e, item_id) => {
    e.preventDefault()
    navigate(`/item-page/${item_id}`)
  }
  return (
    <div className='d-flex flex-column align-items-center'>
      <div className='d-flex flex-column w-75'>
        <div className="text-center my-4 position-relative">
          <h3 className="w-100 text-center" style={{right: '50%'}}>Collection "{collection.name}"</h3>
          {user.id === collection.user_id &&
          <div className="position-absolute" style={{top: '0px', right: '0px'}}>
            <NavLink to='new-collection' className='btn btn-outline-dark me-2'>
              <img src={Edit} width={25} height={25}/> Edit
            </NavLink>
            <button className='btn btn-outline-dark' onClick={handleDeleteCollection}>
              <img src={Trash} width={25} height={25}/> Delete
            </button>
          </div>}
        </div>
        <div className='container'>
          <div className='row'>
            <div className='col'>
              <h5>Description:</h5>
            </div>
            <div className='col-6 w-75'>
              <h4 className='lead ms-3'>{collection.description}</h4>
            </div>
          </div>
          <div className='row mt-3'>
            <div className='col'>
              <h5>Category:</h5>
            </div>
            <div className='col-6 w-75'>
              <h4 className='lead ms-3'>{collection.category}</h4>
            </div>
          </div>
        </div>
        <hr />
        <div className='d-flex justify-content-center'>
          <h4>Items</h4>
        </div>
        {user.id === collection.user_id &&
        <div className='d-flex justify-content-between'>
          <NavLink to='new-item' className='btn btn-outline-dark me-2'>
          <img src={New} width={25} height={25}/> New
          </NavLink>
          <button className='btn btn-outline-dark'>
          <img src={Trash} width={25} height={25}/> Delete
          </button>
        </div>}
        <table className="table table-hover">
          <thead>
            <tr>
              {user.id === collection.user_id &&
              <th>
                <input className="form-check-input me-1" type="checkbox" checked={allChecked} onChange={handleCheckboxChangeAll}/>
              </th>}
              <th>id</th>
              <th>name</th>
              <th>tags</th>
              {Object.keys(collection).filter(val => val.includes('state') && collection[val] == 1).map(val => {
                let fieldName = val.slice(0, val.indexOf('state')) + 'name'
                return (
                  <th>{collection[fieldName]}</th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((val) => {
              return (<tr key={val.id} onClick={(e) => handleItemPage(e, val.id)}>
                <td>
                  <input 
                    type="checkbox"
                    name={val.id}
                    checked={checkedItems[val.id]}
                    onChange={handleCheckboxChange}
                  />
                  </td>
                  <td>{val.collection_name}</td>
                  <td>{val.description}</td>
                  <td>{val.category_name}</td>
              </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CollectionPage
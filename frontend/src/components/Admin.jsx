import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { setUser } from '../features/loginSlice'
import axios from 'axios'
import Lock from '../assets/lock.svg'
import Unlock from '../assets/unlock.svg'
import Trash from '../assets/trash.svg'
import TrashDark from '../assets/trash-dark.svg'
import UserBlock from '../assets/user-block.svg'
import UserAdd from '../assets/user-add.svg'

const Admin = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.login.currentUser)
    const darkMode = useSelector(state => state.mode.darkMode)
    const [data, setData] = useState([])
    useEffect(() =>{
        axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/users/all`)
        .then(res => {
            setData(res.data)
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
    const handleChange = (status) => {
        let data = {
            ids: [],
            field: ['Active', 'Blocked'].includes(status) ? 'status' : 'admin',
            status
        }
        for (let id in checkedItems) {checkedItems[id] && data.ids.push(id)}
        if (data.ids.length) {
            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/users/change`, data)
            .then(res => {
                setData(res.data)
                const updUser = res.data.find(some_user => some_user.id == user.id)
                console.log('found myself', updUser ? updUser : {status: ''})
                dispatch(setUser(updUser ? updUser : {status: ''}))
            })
            .catch(err => console.log(err))
        }
    }
  return (
    <div className={`d-flex flex-column align-items-center min-vh-100 ${darkMode ? 'text-bg-dark' : 'bg-light'}`} data-bs-theme={darkMode && "dark"}>
      <div className='d-flex flex-column w-75'>
        <h3 className='text-center mt-3'>Admin Panel</h3>
        <div className='d-flex justify-content-between'>
            <div>
                <button className='btn btn-outline-danger' onClick={() => handleChange('Blocked')}>
                    <img src={Lock} width={25} height={25}/> Block
                </button>
                <button className='btn btn-outline-success ms-2' onClick={() => handleChange('Active')}>
                    <img src={Unlock} width={25} height={25}/> Unblock
                </button>
                <button className={`btn btn-outline-${darkMode ? 'light' : 'dark'} ms-2`} onClick={() => handleChange('delete')}>
                    <img src={darkMode ? TrashDark : Trash} width={25} height={25}/> Delete
                </button>
            </div>
            <div>
                <button className='btn btn-outline-danger' onClick={() => handleChange(false)}>
                    <img src={UserBlock} width={25} height={25}/> Delete Admin
                </button>
                <button className='btn btn-outline-success ms-2' onClick={() => handleChange(true)}>
                    <img src={UserAdd} width={25} height={25}/> Add Admin
                </button>
            </div>
        </div>
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>
                <input className="form-check-input" type="checkbox" checked={allChecked} onChange={handleCheckboxChangeAll}/>
              </th>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val, ind) => {
              return (
                <tr key={val.id}>
                  <td>
                  <input 
                    type="checkbox"
                    name={val.id}
                    checked={checkedItems[val.id]}
                    onChange={handleCheckboxChange}
                  />
                  </td>
                  <td>{val.id}</td>
                  <td>{val.name}</td>
                  <td>{val.email}</td>
                  <td>{val.status}</td>
                  <td>{val.admin}</td>
              </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Admin
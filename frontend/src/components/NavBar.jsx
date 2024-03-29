import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import Person from '../assets/person.svg'
import Search from '../assets/search.svg'
import Dark from '../assets/night.svg'
import Language from '../assets/language.svg'
import Cloud from '../assets/cloud.svg'
import Admin from '../assets/admin.svg'
import { setUser } from '../features/loginSlice'
import Sample from './Sample'

const NavBar = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.login.currentUser)
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/search?query=${encodeURIComponent(search)}`)
        setSearch('')
    }
    const handleLogout = () => {
        dispatch(setUser({status: ''}))
    }
  return (
    <div className='d-flex flex-column align-items-center bg-light'>
    <div className='d-flex flex-column w-75'>
        <div className="my-3 position-relative">
            <div className="position-absolute" style={{top: '0px', left: '0px'}}>
                {user.status == 'Active' ?
                <NavLink to='my-page' type='button' className='btn btn-outline-dark'>
                    <img src={Person} width={25} height={25}/> My Page
                </NavLink> :
                <h3>Collection Cloud <img src={Cloud} width={30} height={30}/></h3>}
                {user.admin == 1 &&
                <NavLink to='admin' type='button' className='btn btn-outline-dark ms-3'>
                    <img src={Admin} width={25} height={25}/> Admin Panel
                </NavLink>}
            </div>
            <form className="d-flex justify-content-center">
                <div className="input-group" style={{ width: '500px' }}>
                    <input 
                        className="form-control" 
                        type="search" 
                        placeholder="Search" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onBlur={() => setSearch('')} />
                    <button className="input-group-text" type="submit" onClick={handleSearch}>
                        <img src={Search} width={25} height={25} />
                    </button>
                </div>
            </form>
          
          <div className="position-absolute" style={{top: '0px', right: '0px'}}> 
            <button className='btn btn-outline-dark rounded-5 me-3' >
                <img src={Dark} width={25} height={25} />
            </button>
            <button className='btn btn-outline-dark rounded-5 me-5' >
                <img src={Language} width={25} height={25} />
            </button>
            {user.status === 'Active' ? 
            <button className='btn btn-outline-dark' onClick={handleLogout}>Logout</button> :
            <button className='btn btn-outline-dark' data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
            }
          </div>
        </div>
        <Sample heading='Login'/>
        <Sample heading='Sign up'/>
    </div>
    </div>
  )
}

export default NavBar
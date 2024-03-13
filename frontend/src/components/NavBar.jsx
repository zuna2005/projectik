import React from 'react'
import { Link } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import Person from '../assets/person.svg'
import Search from '../assets/search.svg'
import Dark from '../assets/night.svg'
import Language from '../assets/language.svg'
import { setUser } from '../features/login/loginSlice'

const NavBar = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.login.currentUser)
    console.log("user:", user)
  return (
    <div>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid d-flex justify-content-around">
                <button type='button' className='btn btn-outline-dark '><img src={Person} width={25} height={25}/> My Page</button>
                <form className="d-flex">
                    <div className="input-group" style={{ width: '500px' }}>
                        <input className="form-control" type="search" placeholder="Search" />
                        <button className="input-group-text" type="submit">
                            <img src={Search} width={25} height={25} />
                        </button>
                    </div>
                </form>
                <div>
                    <button className='btn btn-outline-dark rounded-5 me-3' >
                        <img src={Dark} width={25} height={25} />
                    </button>
                    <button className='btn btn-outline-dark rounded-5 me-5' >
                        <img src={Language} width={25} height={25} />
                    </button>
                    {user.status === 'Active' ? 
                    <button className='btn btn-outline-dark' onClick={() => dispatch(setUser({status: ''}))}>Logout</button> :
                    <Link to='/login' type='button' className='btn btn-outline-dark'>Login</Link>
                    }
                </div>
                
            </div>
        </nav>
    </div>
  )
}

export default NavBar
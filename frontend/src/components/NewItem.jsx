import React from 'react'
import { useParams, Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import axios from 'axios'
import New from '../assets/plus.svg'
import Trash from '../assets/trash.svg'

const NewItem = () => {
    const user = useSelector(state => state.login.currentUser)
    let { coll_id } = useParams()
    const handleSubmit = () => {
        console.log('yay')
    }
  return (
    <div className='d-flex flex-column align-items-center'>
        <div className='d-flex flex-column w-75 mt-4'>
            <h3>New Item</h3>
            <form onSubmit={handleSubmit}>
                <div className='container'>
                    <div className='row'>
                        <div className='col'>
                            <label htmlFor="item-name" className="form-label">Name</label>
                        </div>
                        <div className='col-6 w-75'>
                            <input type="text" className="form-control" id="item-name" name='name' placeholder="My Item" required />
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col'>
                            <label htmlFor="tags" className="form-label">Tags</label>
                        </div>
                        <div className='col-6 w-75'>
                            <button className='btn btn-outline-dark' onClick={(e)=>e.preventDefault()}
                            data-bs-toggle="dropdown" aria-expanded="false">
                                <img src={New} width={25} height={25}/> Add Tags
                            </button>
                            <ul className="dropdown-menu">
                                <li>lol</li>
                            </ul>
                        </div>
                    </div>
                <div className='mt-4'>
                    <button type='submit' className='btn btn-outline-success me-3'>Create</button>
                    <Link to={`/collection-page/${coll_id}`} className='btn btn-outline-danger'>Cancel</Link>
                </div>
                </div>
        </form>
        </div>
    </div>
  )
}

export default NewItem
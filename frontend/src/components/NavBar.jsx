import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { useTranslation } from 'react-i18next'
import Person from '../assets/person.svg'
import PersonDark from '../assets/person-dark.svg'
import Admin from '../assets/admin.svg'
import AdminDark from '../assets/admin-dark.svg'
import Search from '../assets/search.svg'
import SearchDark from '../assets/search-dark.svg'
import Dark from '../assets/night.svg'
import Light from '../assets/sun.svg'
import Language from '../assets/language.svg'
import LanguageDark from '../assets/language-dark.svg'
import Cloud from '../assets/cloud.svg'
import CloudDark from '../assets/cloud-dark.svg'
import { setUser } from '../features/loginSlice'
import { setMode } from '../features/modeSlice'
import Login from './Login'

const NavBar = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.login.currentUser)
    const darkMode = useSelector(state => state.mode.darkMode)
    const navigate = useNavigate()
    const [t, i18n] = useTranslation()
    const [lng, setLng] = useState('en')
    const [search, setSearch] = useState('')
    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/search?query=${encodeURIComponent(search)}`)
        setSearch('')
    }
    const handleMode = () => {
        dispatch(setMode(!darkMode))
    }
    const handleLang = () => {
        const newLng = lng == 'en' ? 'ru': 'en'
        setLng(newLng)
        i18n.changeLanguage(newLng)
    }
    const handleLogout = () => {
        dispatch(setUser({status: ''}))
    }
  return (
    <div className={`d-flex flex-column align-items-center ${darkMode ? 'text-bg-dark' : 'bg-light'}`} data-bs-theme={darkMode && "dark"}>
    <div className='d-flex justify-content-center'>
        <div className="my-3 d-flex gap-2 flex-wrap justify-content-center">
            <div className='d-flex gap-2 flex-wrap'>
                {user.status == 'Active' ?
                <NavLink to={`user-page/${user.id}`} type='button' className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`}>
                    <img src={darkMode ? PersonDark : Person} width={25} height={25}/> {t('myPage')}
                </NavLink> :
                <h3>{t('collectionCloud')} <img src={darkMode ? CloudDark : Cloud} width={30} height={30}/></h3>}
                {user.admin == 1 &&
                <NavLink to='admin' type='button' className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`}>
                    <img src={darkMode ? AdminDark : Admin} width={25} height={25}/> {t('adminPanel')}
                </NavLink>}
            </div>
            <form className="d-flex align-items-center">
                <div className="input-group w-100">
                    <input 
                        className="form-control" 
                        type="search" 
                        placeholder={t('search')} 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onBlur={() => setSearch('')} />
                    <button className="input-group-text" type="submit" onClick={handleSearch}>
                        <img src={darkMode ? SearchDark : Search} width={25} height={25} />
                    </button>
                </div>
            </form>
          
          <div className='d-flex align-items-center'> 
            <button className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'} rounded-5 me-3`} onClick={handleMode} >
                <img src={darkMode ? Light : Dark} width={25} height={25} />
            </button>
            <button className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'} rounded-5 me-3`} data-bs-toggle="dropdown" aria-expanded="false">
                <img src={darkMode ? LanguageDark : Language} width={25} height={25} />
            </button>
            <ul className="dropdown-menu">
                <li>
                    <button className="dropdown-item" onClick={() => i18n.changeLanguage('en')}>en</button>
                </li>
                <li>
                    <button className="dropdown-item" onClick={() => i18n.changeLanguage('ru')}>ru</button>
                </li>
            </ul>
            {user.status === 'Active' ? 
            <button className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`} onClick={handleLogout}>{t('logout')}</button> :
            <button className={`btn ${darkMode ? 'btn-dark border' : 'btn-outline-dark'}`} data-bs-toggle="modal" data-bs-target="#loginModal">{t('login')}</button>
            }
          </div>
        </div>
        {user.status == '' && <Login heading={t('login')}/>}
        {user.status == '' && <Login heading={t('signUp')}/>}
    </div>
    </div>
  )
}

export default NavBar
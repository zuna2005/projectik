import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

const Tabs = () => {
  const darkMode = useSelector(state => state.mode.darkMode)
  const names = ['Latest Items', 'Largest Collections', 'Tag Cloud']
  const links = ['/', 'largest-collections', 'tag-cloud']
  return (
    <div>
        <ul className={`nav nav-tabs nav-justified ${darkMode ? 'text-bg-dark' : 'bg-light'}`} data-bs-theme={darkMode && "dark"}>
            {names.map((val, id) => {
                return (
                 <li className="nav-item" key={id}>
                    <NavLink to={links[id]} className={"nav-link"} name={val} >{val}</NavLink>
                </li>)
            })}
        </ul>
    </div>
  )
}

export default Tabs
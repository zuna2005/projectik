import React from 'react'
import { NavLink } from 'react-router-dom'

const Tabs = () => {
    // const handleCLick = (event) => {
    //     setCurrentPage(event.target.name)
    // }
    const names = ['Latest Items', 'Largest Collections', 'Tag Cloud']
    const links = ['/', 'largest-collections', 'tag-cloud']
  return (
    <div>
        <ul className="nav nav-tabs nav-justified">
            {names.map((val, id) => {
                return (
                 <li className="nav-item">
                    <NavLink to={links[id]} className={"nav-link"} name={val} >{val}</NavLink>
                </li>)
            })}
        </ul>
    </div>
  )
}

export default Tabs
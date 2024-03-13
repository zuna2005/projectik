import React from 'react'

const Tabs = () => {
  return (
    <div>
        <ul className="nav nav-tabs nav-justified">
            <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Latest Items</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">Largest Collections</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">Tag Cloud</a>
            </li>
        </ul>
    </div>
  )
}

export default Tabs
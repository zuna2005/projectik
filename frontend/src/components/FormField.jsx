import React from 'react'

const FormField = ({name, onChange, errors, heading}) => {
  return (
    <div className='mb-3'>
        <label htmlFor={name + heading} className="form-label">{name.charAt(0).toUpperCase() + name.slice(1)}</label>
        <input 
          id={name + heading}
          type={name==='name' ? 'text': name}
          className="form-control" name={name}
          onChange={onChange}
          placeholder={'Enter your '+ name}
          required/>
        <span className='text-danger'>{errors[name]}</span>
    </div>
  )
}

export default FormField
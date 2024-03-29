import React from 'react'
import { useTranslation } from 'react-i18next'

const FormField = ({name, onChange, errors, heading}) => {
  const [t, i18n] = useTranslation()
  return (
    <div className='mb-3'>
        <label htmlFor={name + heading} className="form-label">{t(name).charAt(0).toUpperCase() + t(name).slice(1)}</label>
        <input 
          id={name + heading}
          type={name==='name' ? 'text': name}
          className="form-control" name={name}
          onChange={onChange}
          placeholder={t('enter') + t(name)}
          required/>
        <span className='text-danger'>{errors[name]}</span>
    </div>
  )
}

export default FormField
import React from 'react'
import '../styles/Button.css'

const Button = ({onClick, label, buttonName}) => {
  return (
    <button className={buttonName} onClick={onClick}>
      {label}
    </button>
  )
}

export default Button
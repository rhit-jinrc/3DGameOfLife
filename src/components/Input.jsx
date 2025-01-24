import React from 'react'
import '../styles/Input.css'

const Input = ({ label, input, onChange }) => {
    const handleInputChange = (e) => {
        const newValue = parseInt(e.target.value, 10);
        if(!isNaN(newValue) && newValue > 0) {
            onChange(newValue);
            console.log("new value input");
        }
    };

  return (
    <div className='input-container'>
        <label>{label}:</label>
        <input
            type='number'
            min={1}
            max={10}
            value={input}
            onChange={handleInputChange}
            onBlur={handleInputChange}
            className='number-input'
        />
    </div>
  );
};

export default Input
import React from 'react'
import '../styles/ShapeSelector.css'

const ShapeSelector = ({ selectedShape, onChange }) => {
    const handleShapeChange = (e) => {
        onChange(e.target.value);
        console.log("changed shape");
    };

  return (
    <div className='shape-selector'>
        <label>Shape:</label>
        <select id="shape" value={selectedShape} onChange={handleShapeChange} className='selector-container'>
            <option value="random">Random</option>
            <option value="cube">Cube</option>
            <option value="hollow">Hollow</option>
            <option value="cross">Cross</option>
            <option value="diamond">Diamond</option>
            <option value="checkers">Checkers</option>
        </select>
    </div>
  )
}

export default ShapeSelector
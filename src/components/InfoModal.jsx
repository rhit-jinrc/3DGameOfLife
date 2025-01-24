import React, {useState} from 'react'
import '../styles/InfoModal.css'

const InfoModal = ({rules}) => {
    const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
        className='infomodal-container' 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        <span className='info-icon'>ℹ️</span>
        {isHovered && (
            <div>
                <h3>Game Rules</h3>
                <p>{rules}</p>
            </div>
        )}
    </div>
  )
}

export default InfoModal
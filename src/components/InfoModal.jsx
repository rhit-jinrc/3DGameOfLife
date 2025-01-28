import React, {useState} from 'react'
import '../styles/InfoModal.css'

const InfoModal = () => {
    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal);
    }

  return (
    <div>
        <button className="btn-modal" onClick={toggleModal}>
            Rules
        </button>

        {modal &&
        <div className="modal">
            <div className="overlay" onClick={toggleModal}></div>
            <div className="modal-content">
                <h2>Rules</h2>
                <p>1. Live cells with 5 or 6 live neighbors survive</p>
                <p>2. Dead cells with 4 live neighbors revive</p>
                <button className="close-modal" onClick={toggleModal}>Close</button>
            </div>
        </div>
        }
    </div>
  )
}

export default InfoModal
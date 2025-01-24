import React from 'react'

const Dashboard = ({ generation, livingCells }) => {
  return (
    <div className='dashboard'>
        <p>Generation: {generation}</p>
        <p>Living Cells: {livingCells}</p>
    </div>
  )
}

export default Dashboard
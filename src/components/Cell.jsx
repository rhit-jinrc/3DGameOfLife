import React from 'react'
import {Box} from '@react-three/drei'

const Cell = ({position, isAlive}) => {
    const color = isAlive ? "red" : "lightgray";
    const opacity = isAlive ? 0.75 : 0;

      const cellScale = 0.5;

  return (
    <Box 
        position={position} 
        scale={[cellScale, cellScale, cellScale]} 
    >
        <meshStandardMaterial 
            attach={"material"} 
            color={color} 
            transparent={true}
            opacity={opacity}
        />
    </Box>
  )
}

export default Cell;
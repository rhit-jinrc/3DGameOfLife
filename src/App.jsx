import React, {useRef, useState} from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Grid from './components/Grid'
import Button from './components/Button'
import Input from './components/Input'
import Dashboard from './components/Dashboard'
import ShapeSelector from './components/ShapeSelector'
import InfoModal from './components/InfoModal'
import "./App.css"

const App = () => {
  const [generation, setGeneration] = useState(0);
  const [livingCells, setLivingCells] = useState(0);

  const gridRef = useRef();
  const [activeRegionSize, setActiveRegionSize] = useState(2); //Default active region size of 2
  const [selectedShape, setSelectedShape] = useState("random");
  
  const evolveCells = () => {
    if(gridRef.current) {
      gridRef.current.evolveCells();
      setGeneration((prevGen) => prevGen + 1);
      console.log("evolving");
    }
  };

  const resetCells = () => {
    if (gridRef.current) {
      gridRef.current.resetCells();
      resetGeneration(); 
    }
  };

  const handleActiveRegionChange = (newSize) => {
    setActiveRegionSize(newSize);
    resetGeneration();
  }

  const handleLivingCellsUpdate = (count) => {
    setLivingCells(count);
  };

  const resetGeneration = () => {
    setGeneration(0);
  }

  const handleShapeChange = (newShape) => {
    setSelectedShape(newShape);
    setGeneration(0);
  };

  return (
    <div className="app-container">
      <h1>
        The Game of Life 3D
      </h1>
      <div className='dashboard-container'>
        <Dashboard 
          generation={generation} 
          livingCells={livingCells} 
        />
      </div>
      <div className="canvas-container">
        {/* <InfoModal rules={gameRules} /> */}
        <Canvas camera={{ position: [5, 5, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Grid 
            ref={gridRef} 
            activeRegionSize={activeRegionSize} 
            onLivingCellsUpdate={handleLivingCellsUpdate} 
            selectedShape={selectedShape} 
          />
          <OrbitControls target={[0, 0, 0]} />
        </Canvas>
      </div>
      <div className="button-container">
        <Button buttonName={"evolve-button"} onClick={evolveCells} label="Evolve Cells" />
        <Button buttonName={"reset-button"} onClick={resetCells} label="Reset Cells" />
      </div>
      <div className="controls-container">
        <Input
          label="Active Region Size"
          value={activeRegionSize}
          onChange={handleActiveRegionChange}
        />
        <ShapeSelector 
          selectedShape={selectedShape}
          onChange={handleShapeChange}
        />
      </div>
    </div>
  )
}

export default App;

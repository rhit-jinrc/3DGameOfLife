import React, {useRef, useState, useImperativeHandle, forwardRef} from 'react'
import Cell from './Cell'
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
// import { select } from 'three/tsl';

const Grid = forwardRef((props, ref) => {
    const gridSize = 16;
    const { activeRegionSize, selectedShape } = props;
    const spacing = 0.5;
    const cells = [];

    const groupRef = useRef();

    // Rotate the cells
    useFrame(() => {
        if(groupRef.current) {
            // groupRef.current.rotation.x += 0.002;
            groupRef.current.rotation.y += 0.02;
        }
    });

    const activeStart = Math.floor((gridSize - activeRegionSize) / 2);
    const activeEnd = activeStart + activeRegionSize - 1;

    const centerOffsetAdjustment = (activeRegionSize % 2 == 0) ? 0 : spacing / 2;
    const centerOffset = ((gridSize - 1) * spacing) / 2 - centerOffsetAdjustment;
    
    const generateInitialCellStates = (gridSize, activeStart, activeEnd, selectedShape) => {
        let livingCellCount = 0;
    
        const initialStates = Array(gridSize)
            .fill(null)
            .map((_, x) =>
                Array(gridSize)
                    .fill(null)
                    .map((_, y) =>
                        Array(gridSize)
                            .fill(false)
                            .map((_, z) => {
                                let isAlive = false;

                                switch (selectedShape) {
                                    case "random":
                                        isAlive = x >= activeStart && x <= activeEnd &&
                                              y >= activeStart && y <= activeEnd &&
                                              z >= activeStart && z <= activeEnd
                                              ? Math.random() > 0.5
                                              : false;
                                        break;
                                    
                                    case "cube":
                                        isAlive = x >= activeStart && x <= activeEnd &&
                                            y >= activeStart && y <= activeEnd &&
                                            z >= activeStart && z <= activeEnd;
                                        break;

                                    case "cross":
                                        const center = Math.floor((activeStart + activeEnd) / 2); 

                                        isAlive =
                                            (x == center && y >= activeStart && y <= activeEnd && z >= activeStart && z <= activeEnd) || 
                                            (y == center && x >= activeStart && x <= activeEnd && z >= activeStart && z <= activeEnd) || 
                                            (z == center && x >= activeStart && x <= activeEnd && y >= activeStart && y <= activeEnd);   
                                        break; 

                                    case "hollow":
                                        isAlive =
                                            ((y == activeStart || y == activeEnd) && (z == activeStart || z == activeEnd) 
                                            && x >= activeStart && x <= activeEnd) ||
                                            ((x == activeStart || x == activeEnd) && (z == activeStart || z == activeEnd) 
                                            && y >= activeStart && y <= activeEnd) ||
                                            ((x == activeStart || x == activeEnd) && (y == activeStart || y == activeEnd) 
                                            && z >= activeStart && z <= activeEnd);
                                        break;

                                    case "diamond":
                                        const diamondHeight = activeEnd - activeStart + 1;
                                        const diamondCenterX = Math.floor((activeStart + activeEnd) / 2);
                                        const diamondCenterY = Math.floor((activeStart + activeEnd) / 2);
                                    
                                        isAlive =
                                            Math.abs(x - diamondCenterX) +
                                            Math.abs(y - diamondCenterY) +
                                            Math.abs(z - activeStart - Math.floor(diamondHeight / 2)) <= Math.floor(diamondHeight / 2);
                                        break;

                                    case "checkers":
                                        const isInActiveRegionCheckers = (x >= activeStart && x <= activeEnd &&
                                        y >= activeStart && y <= activeEnd &&
                                        z >= activeStart && z <= activeEnd);
                                        isAlive = (x + y + z) % 2 == 0 && isInActiveRegionCheckers;
                                        break;
                                    
                                    default:
                                        isAlive = false;
                                }

                                if (isAlive) {
                                    livingCellCount++;
                                    console.log("living cell");
                                }
                                return isAlive;
                            })
                    )
            );
    
        // Call the parent's setLivingCells method to update it
        if (props.onLivingCellsUpdate) {
            props.onLivingCellsUpdate(livingCellCount);
        }
    
        return initialStates;
    };
    

    const [cellStates, setCellStates] = useState(() =>
        generateInitialCellStates(gridSize, activeStart, activeEnd, selectedShape)
    );

    // Recreate cell states when activeRegionSize changes
    React.useEffect(() => {
        setCellStates(generateInitialCellStates(gridSize, activeStart, activeEnd, selectedShape));
    }, [activeRegionSize, selectedShape]);

    const toggleCellState = (x, y, z) => {
        setCellStates((previousState) => {
            const newState = [...previousState];
            newState[x][y][z] = !newState[x][y][z];
            return newState;
        });
    };

    const countLiveNeighbors = (x, y, z) => {
        const offsets = [-1, 0, 1];
        let liveCount = 0;

        for (let dx of offsets) {
            for (let dy of offsets) {
                for (let dz of offsets) {
                if (dx == 0 && dy == 0 && dz == 0) continue;

                const neighborX = x + dx;
                const neighborY = y + dy;
                const neighborZ = z + dz;

                if (
                    neighborX >= 0 &&
                    neighborX < gridSize &&
                    neighborY >= 0 &&
                    neighborY < gridSize &&
                    neighborZ >= 0 &&
                    neighborZ < gridSize &&
                    cellStates[neighborX][neighborY][neighborZ]
                ) {
                    liveCount++;
                }
                }
            }
        }

    return liveCount;
    };

    const evolveCells = () => {
        setCellStates((prevState) => {
            const newStates = prevState.map((plane, x) =>
                plane.map((row, y) =>
                row.map((isAlive, z) => {
                    const liveNeighbors = countLiveNeighbors(x, y, z);
        
                    if (isAlive) {
                    return liveNeighbors >= 5 && liveNeighbors <= 6; // Stay alive
                    } else {
                    return liveNeighbors == 4; // Revive if exactly 4 live neighbors
                    }
                })
                )
            );

            const livingCellCount = newStates.flat(2).filter((cell) => cell).length;

            // Call the parent's setLivingCells method to update it
            if (props.onLivingCellsUpdate) {
                props.onLivingCellsUpdate(livingCellCount);
            }
            
            return newStates;
        });
    };

    const countLivingCells = () => {
        let livingCellCount = 0;
        cellStates.forEach((plane) =>
          plane.forEach((row) =>
            row.forEach((isAlive) => {
              if (isAlive) livingCellCount++;
            })
          )
        );
        return livingCellCount;
      };

    useImperativeHandle(ref, () => ({
        evolveCells, countLivingCells,
    }));

    useImperativeHandle(ref, () => ({
        evolveCells,
        countLivingCells,
        resetCells: () => {
          setCellStates(generateInitialCellStates(gridSize, activeStart, activeEnd, selectedShape));
        },
    }));

    for(let i = 0; i < gridSize; i++) {
        for(let j = 0; j < gridSize; j++) {
            for(let k = 0; k < gridSize; k++) {
                const isInActiveRegion = (
                    i >= activeStart && i <= activeEnd &&
                    j >= activeStart && j <= activeEnd &&
                    k >= activeStart && k <= activeEnd
                );

                const isAlive = isInActiveRegion ? Math.random() > 0.5 : false;

                cells.push(
                    <Cell 
                        key={`${i}-${j}-${k}`} 
                        position={[
                            i * spacing - centerOffset, 
                            j * spacing - centerOffset, 
                            k * spacing - centerOffset]} 
                        isAlive={cellStates[i][j][k]}
                    /> //Identify cells by their key: "i-j-k"
                )
            }
        }
    }

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {cells}
            {/* <Sphere args={[0.1, 32, 32]} position={[0, 0, 0]}>
                <meshStandardMaterial color="yellow" />
            </Sphere> */}
        </group>
        
    );
});

export default Grid;
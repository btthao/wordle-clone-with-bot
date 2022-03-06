import React, { useEffect, useState } from 'react'
import {RiDeleteBack2Line} from 'react-icons/ri'
import { useStateContext } from '../context';
import { flipTime, wordLength } from '../utils/constants';
import { TileState } from './Tile';
import '../styles/Key.css'

interface KeyProps {
    value: string,
    onClick: () => void,
}


const Key: React.FC<KeyProps> = ({value, onClick}) => {
    const [{ gameState }, _] = useStateContext();
    const [state, setState] = useState<string|null>(null)
    const [stateIsFinal, setStateIsFinal] = useState(false)
    
    useEffect(() => {
        const boardState = gameState.boardState;
        const evaluations = gameState.evaluations;
        
        // reset if new game
        if (boardState[0][0] === ''){
            setStateIsFinal(false)
            setState(null)
        } else if (boardState[0][0] !== '' && !stateIsFinal){
            let temporaryState:string|null = null
            
            for (let i = 0; i < boardState.length; i++){
                for (let k = 0; k < boardState[0].length; k++){
                    
                    if (temporaryState === TileState.Correct) break
                    
                    if (boardState[i][k] === value){
                        if (evaluations[i][k] === TileState.Correct){
                            temporaryState = TileState.Correct
                            setStateIsFinal(true)
                            break
                        } else if (evaluations[i][k] === TileState.Present){
                            temporaryState = TileState.Present
                        } else if (evaluations[i][k] === TileState.Absent && !temporaryState ){
                            temporaryState = TileState.Absent
                        }
                    }
                }
            }
            
            
            // wait till all tiles flip
            setTimeout(() => {
                setState(temporaryState)
            }, (wordLength-1)*350 + flipTime)
            
        }
        
    },[gameState.boardState, gameState.evaluations, stateIsFinal, value, state])
    
    return (
        <button data-state={state} data-key={value} className={`${value.length > 1 ? 'one-half' : ''}`} onClick={(e) => {onClick(); e.currentTarget.blur()}}>
            {value !== 'Backspace' ? value : <RiDeleteBack2Line style={{fontSize: '20px'}}/>}
        </button>
    );
}

export default Key
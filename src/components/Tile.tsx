import React, { useEffect, useState } from 'react'
import '../styles/Tile.css'
import { flipTime, wordLength } from '../utils/constants'

interface TileProps {
    value: string
    state: string
    order: number
    win: boolean
}

export enum TileState {
    Empty = "EMPTY",
    Tbd = "TBD",
    Present = "PRESENT",
    Absent = "ABSENT",
    Correct = "CORRECT",
}


const Tile: React.FC<TileProps> = ({value, state, order, win}) => {
    const [animation, setAnimation] = useState('none')
    const [animationDelay, setAnimationDelay] = useState('0ms')
    const [tileState, setTileState] = useState(state)
    const [cssClass, setCssClass] = useState('tile')
    
    // delay state change + animation
    useEffect(() => {
        if (state === TileState.Empty){
            setTileState(state)
        } else if (state === TileState.Tbd){
            setTileState(state)
            setAnimation('pop-in')
            setTimeout(() => {
                setAnimation('none')
            }, 100)
        } else {
            setTimeout(() => {
                setAnimation('flip')
            }, order*350)
            
            setTimeout(() => {
                setTileState(state)
            }, order*350 + flipTime/2)
            
            setTimeout(() => {
                setAnimation('none')
            }, order*350 + flipTime)
        }
    }, [state, order])
    
    // win animation
    useEffect(() => {
        setTimeout(() => {
            if (win) {
                setAnimationDelay(order*100 + 'ms')
                setCssClass('tile win')
            } else{
                setAnimationDelay('0ms')
                setCssClass('tile')
            }
        }, (wordLength-1)*350 + flipTime)
    }, [order, win])
   
    
    return (
        <div className={cssClass} data-state={tileState} data-animation={animation} 
        style={{animationDelay: animationDelay}}>
            {value}
        </div>
    );
}

export default Tile


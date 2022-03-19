import React, { useEffect, useState } from 'react'
import { useStateContext } from '../context'
import { GameStatus } from '../reducer'
import { flipTime, wordLength } from '../utils/constants'

interface HelpBotContentProps {
    guess: string,
}

const HelpBotContent: React.FC<HelpBotContentProps> = ({guess}) => {
    const [text, setText] = useState('I will suggest words as you play so we can find the solution together.')
    const [showGuess, setShowGuess] = useState(false)
    const [currentGuess, setCurrentGuess] = useState('')
    const [warning, setWarning] = useState('')
    const [{ gameState, hardMode }, _] = useStateContext();
    
    // reset
    useEffect(() => {
        if (gameState.rowIndex === 0){
            setText('I will suggest words as you play so we can find the solution together.')
            setShowGuess(false)
            setCurrentGuess('')
            setWarning('')
        } 
    }, [gameState.rowIndex])
    
    
    // set next guess, wait till all tiles have flipped
    useEffect(()=> {
            setTimeout(() => {
                setCurrentGuess(guess)
            }, currentGuess === '' ? 0 : (wordLength-1)*350 + flipTime)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guess])
    
    
    // display guess
    useEffect(() => {
        if ( showGuess && currentGuess !== ''){
            setText('Current guess is  ' + currentGuess.toUpperCase())
        }
    }, [currentGuess, showGuess])
    
    
    // game over
    useEffect(()=> {
        
        if (showGuess && gameState.gameStatus !== GameStatus.In_progress){
            setTimeout(() => {
                setText(gameState.gameStatus === GameStatus.Win ? 'Yay!!' : 'Oh well :(')
                setWarning('')
            }, (wordLength-1)*350 + flipTime)
        }

    }, [gameState.gameStatus, showGuess])
    
    
    // player not using bot
    useEffect(() => {
        if (gameState.rowIndex > 0 && !showGuess){
            setText('Bot can only be enabled before the game starts.')
        }
    }, [gameState.rowIndex, showGuess])
    
    
    // warning when player entered a word bot didn't suggest
    useEffect(() => {
        if (warning === '' && gameState.rowIndex > 0 && showGuess){
            if (gameState.boardState[gameState.rowIndex-1].join('') !== currentGuess){
                setWarning("* You have entered a different word. I won't guarantee we'll win this game.")
            } 
        } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState.boardState])
    

    return (
        <div> 
            {hardMode ? (<p>I don't do hard mode unfortunately :( </p>) : (
                <>
                    <p>{text}</p>
                    
                    {warning !== '' && 
                        <>
                            <br/>
                            <small>{warning}</small>
                        </>
                    }
                    
                    {gameState.rowIndex === 0 && !showGuess && 
                        <button className='bot-btn' onClick={() => setShowGuess(true)}>Let's go</button>
                    }
                </>
            )} 
        </div>
    );
}

export default HelpBotContent
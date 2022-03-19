import produce from "immer";
import React, { useCallback, useEffect, useState } from 'react';
import GameOver from './components/GameOver';
import Header from './components/Header';
import Key from './components/Key';
import MessagePopUp from './components/MessagePopUp';
import Tile, { TileState } from './components/Tile';
import { useStateContext } from "./context";
import { GameStatus } from './reducer';
import './styles/App.css';
import { checkWin, compare, validateGuess } from "./utils/checkAnswers";
import { attempts, flipTime, keys, wordLength } from './utils/constants';
import { solutionList } from './utils/list';

const App: React.FC = () => {
  const [{ gameState, darkTheme, hardMode }, dispatch] = useStateContext();
  const [guesses, setGuesses] = useState(new Array(attempts).fill(new Array(wordLength).fill('')))
  const [tempEvaluations, setTempEvaluations] = useState(new Array(attempts).fill(new Array(wordLength).fill(TileState.Empty)))
  const [rowStatus, setRowStatus] = useState(new Array(attempts).fill(null))
  const [message, setMessage] = useState<string|null>(null)
  const [currentTile, setCurrentTile] = useState<number>(0)
  const [animating, setAnimating] = useState<boolean>(false)
  
  const newSolution = () => {
    const max = solutionList.length - 1
    const min = 0
    const randomIdx = Math.floor(Math.random() * (max - min + 1)) + min
    const solution = solutionList[randomIdx]
    dispatch({
        type: "UPDATE_GAME_STATE",
        payload: {
          solution
        },
    });
  }
  
  const reset = () => {
    dispatch({
      type: "RESET"
    })
    newSolution()
    setGuesses(new Array(attempts).fill(new Array(wordLength).fill('')))
    setTempEvaluations(new Array(attempts).fill(new Array(wordLength).fill(TileState.Empty)))
    setRowStatus(new Array(attempts).fill(null))
    setMessage(null)
    setCurrentTile(0)
    setAnimating(false)
  }
  
  const showMessage = (text: string, now: boolean, hide: boolean,) => {
    
    setTimeout(() => {
      setMessage(text)
    }, now ? 0 : (wordLength-1)*350 + flipTime)
    
    if (hide) {
      setTimeout(() => {
        setMessage(null)
      }, 2000)
    }
    
  }
  
  const guess = useCallback((e: KeyboardEvent | string) => {

    if (gameState.solution === '' || animating || gameState.gameStatus !== GameStatus.In_progress) return 
    
    setAnimating(true)
    
    const value = typeof e === 'string' ? e : e.key
    const regex = /^[A-Za-z]$/
    const currentRow = gameState.rowIndex
    let newGuesses = null
    let newTempEvaluations = null
    let isValid: string | boolean = false
    
    if (regex.test(value)) {
      // if valid char and tile is empty
      if (currentTile < wordLength && tempEvaluations[currentRow][currentTile] === TileState.Empty){
        newGuesses = produce(guesses, copy => {
          copy[currentRow][currentTile] = value.toLowerCase() 
        })
        newTempEvaluations = produce(tempEvaluations, copy => {
          copy[currentRow][currentTile] = TileState.Tbd 
        })
        
        setCurrentTile(currentTile => currentTile + 1)
      }
      
    } else if (value === 'Backspace'){
      
      if (currentTile > 0 && tempEvaluations[currentRow][currentTile-1] !== TileState.Empty){
        newGuesses = produce(guesses, copy => {
          copy[currentRow][currentTile - 1] = '' 
        })
        newTempEvaluations = produce(tempEvaluations, copy => {
          copy[currentRow][currentTile - 1] = TileState.Empty 
        })
        setCurrentTile(currentTile => currentTile - 1)
      }
      
    } else if (value === 'Enter'){
      
      isValid = validateGuess(guesses[currentRow].join(''), gameState.boardState, gameState.evaluations, hardMode)
      
      if (isValid !== true){
        let newRowStatus = produce(rowStatus, copy => {
          copy[currentRow] = 'invalid' 
        })
        setRowStatus(newRowStatus)
        showMessage(isValid, true, true)
        
        setTimeout(() => {
          newRowStatus = produce(rowStatus, copy => {
            copy[currentRow] = null 
          })
          setRowStatus(newRowStatus)
        }, 1000)
        
      } else {
        // guess is valid, now check
        const compareResult = compare(guesses[currentRow].join(''), gameState.solution)
        const isWinner = checkWin(compareResult)
        
        newTempEvaluations = produce(tempEvaluations, copy => {
          copy[currentRow] = compareResult 
        })
        
        dispatch({
            type: "UPDATE_GAME_STATE",
            payload: {
              boardState: guesses,
              evaluations: newTempEvaluations,
              rowIndex: currentRow + 1
            },
        });
        setCurrentTile(0)
          
        if (isWinner){
            dispatch({
              type: "WIN"
            })
            showMessage('Splendid!', false, false)   
        } else if (currentRow === attempts - 1){
            dispatch({
              type: "FAIL"
            })
            showMessage(gameState.solution.toUpperCase(), false, false)
        }
 
      }
      
    }
    
    if (newGuesses){
      setGuesses(newGuesses)
    }
    
    if (newTempEvaluations){
      setTempEvaluations(newTempEvaluations)
    }
    
    setTimeout(() => {
      setAnimating(false)
    }, isValid === true ? (wordLength-1)*350 + flipTime : 0)

    
  }, [animating, currentTile, dispatch, gameState.boardState, gameState.evaluations, gameState.gameStatus, gameState.rowIndex, gameState.solution, guesses, hardMode, rowStatus, tempEvaluations])
  
  // get local storage on first load 
  useEffect(() => {
    const data = ['gameState', 'darkTheme', 'hardMode']
    
    for (let key of data) { 
      let value: any = localStorage.getItem(key)
      
      if (value){
        if (value === 'true'){
          value = true
        } else if (value === 'false'){
          value = false
        } else {
          value = JSON.parse(value)
        }
        
        const type = key === 'gameState' ? "UPDATE_GAME_STATE" : key === 'darkTheme' ?  "SET_DARK_THEME" :  "SET_HARD_MODE"
        
        
        if (type === 'UPDATE_GAME_STATE'){
          setGuesses(value.boardState)
          setTempEvaluations(value.evaluations)
          if (value.gameStatus !== GameStatus.In_progress){
            showMessage(value.solution.toUpperCase(), false, false)
          }
        }
        
        dispatch({
            type,
            payload: value,
        });
        
      } 
      
    }
    
    if (!localStorage.getItem('gameState')){
      newSolution()
    }
    

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  
  // update local storage whenever game state changes
  useEffect(() => {
    const data = {gameState, darkTheme, hardMode}
    
    for (let [key, value] of Object.entries(data)) { 
      localStorage.setItem(key, JSON.stringify(value))
    }
    

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.boardState, gameState.evaluations, gameState.rowIndex, gameState.gameStatus, gameState.solution, hardMode, darkTheme])
  
  
  // keydown event
  useEffect(() => {

    window.addEventListener('keydown', guess)
    
    return () => {
      window.removeEventListener('keydown', guess)
    }
    
  },[guess])


  return (
    <div className="App">
      <Header/>
      <div id="main-container">
        <div id="game-board">
          {[...Array(attempts)].map((_, i) =>
            <div key={'row-' + i} className={`row ${rowStatus[i] === 'invalid' ? 'invalid' : ''}`}>
              {[...Array(wordLength)].map((_, k) =>
                <Tile key={'row-' + i + '-tile-' + k} value={guesses[i][k]} state={tempEvaluations[i][k]} order={k} win={gameState.gameStatus === GameStatus.Win && gameState.rowIndex - 1  === i} />
              )}
            </div>
          )}
        </div>
      </div>
      <div id="keyboard">
        {keys.map((row, i) => (
          <div key={'key-row-' + i} className="row">
            {i === 1 && (
              <div className='half'></div>
            )}
            {row.split(',').map(key => (
              <Key key={'key-val-' + key} value={key} onClick={() => guess(key)}/>
            ))}
            {i === 1 && (
              <div className='half'></div>
            )}
          </div>
        ))}
      </div>
      {message && (
        <MessagePopUp message={message}/>
      )}
      {gameState.gameStatus !== GameStatus.In_progress && (
        <GameOver
        onClick = {reset}
        />
      )}
    </div>
  );
}

export default App;

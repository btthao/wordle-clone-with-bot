import { TileState } from "../components/Tile";
import { wordLength } from "./constants";
import { acceptedList, solutionList } from "./list";



const charOrder = ['1st', '2nd', '3rd', '4th', '5th']
const fullList = [...solutionList, ...acceptedList]

export const validateGuess = (str: string, board: [string][],evaluations: [string][], hardMode: boolean) => {
    let output: boolean | string = true
    
    str = str.toLowerCase()
    
    if (str.length < wordLength){
      output = 'Not enough letters'
      return output
    } 
    
    if (!fullList.includes(str)){
      output = 'Not in word list'
      return output
    }
    
    if (hardMode){
      for (let i = 0; i < evaluations.length; i++){
        for (let k = 0; k < evaluations[0].length; k++){
          if (evaluations[i][k] === TileState.Empty) break
          
          if (evaluations[i][k] === TileState.Correct && str[k] !== board[i][k]){
            output = `${charOrder[k]} letter must be ${board[i][k].toUpperCase()}`
            break
          } else if (evaluations[i][k] === TileState.Present && !str.includes(board[i][k]) && output === true){
            output = `Guess must contain ${board[i][k].toUpperCase()}`
            break
          }
          
        }
      }
    }
   
    return output
}

const getCharPos = (word: string) => {
    let obj: any = {}
    
    for (let i = 0; i < word.length; i++){
        const char = word[i]
        if (char in obj){
          obj[char] = [...obj[char], i]
        } else {
          obj[char] = [i]
        }
    }
    
    return obj
}
  
export const compare = (guess: string, solution: string) => {

    const output = []
    guess = guess.toLowerCase()
    solution = solution.toLowerCase()
    const solutionChars: any = getCharPos(solution)

    for (let i = 0; i < guess.length; i++){
      const char = guess[i]
      
      if (char in solutionChars){
        
        const charPosSolution = solutionChars[char]

        if (charPosSolution.includes(i)){
          output.push(TileState.Correct)
          solutionChars[char] = solutionChars[char].filter((x: number) => x !== i)
        } else {
          output.push(TileState.Present)
        }
        
      } else {
        output.push(TileState.Absent)
      }
    }
    
    
    for (let i = 0; i < output.length; i++){
      const char = guess[i]
      if (output[i] === TileState.Present){
        const charPosSolution = solutionChars[char]
        if (charPosSolution.length === 0){
          output[i] = TileState.Absent
        } else {
          solutionChars[char].shift()
        }
      }
    }
    
    return output
  }
  
export const checkWin = (compareResult: string[]) => {
    for (let i = 0; i < compareResult.length; i++){
        if (compareResult[i] !== TileState.Correct){
            return false
        }
    }
    
    return true
}
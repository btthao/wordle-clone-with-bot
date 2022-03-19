import {
    Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent,
    PopoverHeader, PopoverTrigger
} from '@chakra-ui/react';
import React, { useEffect, useState, } from 'react';
import { FaRobot } from 'react-icons/fa';
import { useStateContext } from '../context';
import { gen_char_position_count, gen_frequency_count, is_possible_solution } from '../utils/helpBot';
import { solutionList } from '../utils/list';
import HelpBotContent from './HelpBotContent';


const HelpBot: React.FC = () => {
    const [{ gameState }, _] = useStateContext();
    const [guess, setGuess] = useState('later')
    const [needNewGuess, setNeedNewGuess] = useState(false)
    const [filteredWords, setFilteredWords] = useState(solutionList)
    const [ignoredChars, setIgnoredChars] = useState('')
    
    // reset
    useEffect(() => {
        if (gameState.rowIndex > 0){
            setNeedNewGuess(true)
        } else {
            setGuess('later')
            setNeedNewGuess(false)
            setFilteredWords(solutionList)
            setIgnoredChars('')
        }
    }, [gameState.rowIndex])
    
    useEffect(() => {
        if (needNewGuess) {
            setNeedNewGuess(false)
            
            const [rowIndex, boardState, evaluations] = [gameState.rowIndex, gameState.boardState, gameState.evaluations]
            
            // filter words based on latest guess result
            const newFilteredWords = filteredWords.filter(word => is_possible_solution(word, boardState[rowIndex-1], evaluations[rowIndex - 1]))
            setFilteredWords(newFilteredWords)
            
            
            // ignore chars we already know to be in the solution
            let newIgnoredChars = ignoredChars
            for (let i = 0; i < evaluations[rowIndex - 1].length; i++){
                if (evaluations[rowIndex - 1][i] !== 'ABSENT'){
                    if (!newIgnoredChars.includes(guess[i])){
                        newIgnoredChars += guess[i]
                    }
                }
            }
            setIgnoredChars(newIgnoredChars)
            
            // make guess
            
            if (newFilteredWords.length <= 2){
                setGuess(newFilteredWords[0])
            } else {
                const frequencyCounts = gen_frequency_count(newFilteredWords, newIgnoredChars)
                const charPosCounts = gen_char_position_count(newFilteredWords)
                let bestWord = newFilteredWords[0]
                let maxFrequencyScore = 0
                let maxPositionScore = 0
                
                // suggest word from full list instead of filtered list to gain the most information
                for (const word of solutionList){
                    let frequencyScore = 0
                    let passed = new Set()
                    
                    for (const char of word){
                        if (!passed.has(char)){
                            passed.add(char)
                            if (char in frequencyCounts){
                                frequencyScore += frequencyCounts[char]
                            }
                        }
                    }
                    
                    if (frequencyScore > maxFrequencyScore){
                        let positionScore = 0
                        for (let i = 0; i < word.length; i++){
                            const char = word[i]
                            if (char in charPosCounts[i]){
                                positionScore += charPosCounts[i][char]
                            }
                        }
                        maxPositionScore = positionScore
                        maxFrequencyScore = frequencyScore
                        bestWord = word
                    } else if (frequencyScore === maxFrequencyScore){
                        let positionScore = 0
                        for (let i = 0; i < word.length; i++){
                            const char = word[i]
                            if (char in charPosCounts[i]){
                                positionScore += charPosCounts[i][char]
                            }
                        }
                        
                        if (positionScore > maxPositionScore){
                            maxPositionScore = positionScore
                            bestWord = word
                        }
                        
                    }
                    
                }
                
                setGuess(bestWord)
            }
            
 
        }
        
    }, [needNewGuess])
    
    return (
        <Popover closeOnBlur={true} autoFocus={false} defaultIsOpen={false}>
            <PopoverTrigger>
                <button>
                    <FaRobot/>
                </button>
            </PopoverTrigger>
            <PopoverContent className='bot-popover'>
                <PopoverArrow className='bot-popover-arrow'/>
                <PopoverHeader>I'm your help bot!</PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody textAlign='left'>
                    <HelpBotContent guess={guess}/>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}

export default HelpBot


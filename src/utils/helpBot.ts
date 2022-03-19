export const gen_frequency_count = (filteredWords: string[], ignoredChars: string) => {
    let frequency: {[key: string]: number} = {}
    
    for (const word of filteredWords){
        for (const char of word){
            if (ignoredChars.includes(char)) continue
            
            if (!(char in frequency)){
                frequency[char] = 0
            }
            
            frequency[char] += 1
        }
    }
    
    return frequency
}

export const gen_char_position_count = (filteredWords: string[]) => {
    let position_counts: {[key: string]: number}[] = [{}, {}, {}, {}, {}]
    
    for (const word of filteredWords){
        for (let i = 0; i < word.length; i++){
            const char = word[i]
            if (!(char in position_counts[i])){
                position_counts[i][char] = 0
            }
            position_counts[i][char] += 1
        }
    }
    
    return position_counts
}


export const is_possible_solution = (word: string, guess: string[], guessResult:string[]) => {
    
    for (let i = 0; i < guessResult.length; i++){
        if (guessResult[i] === 'CORRECT' && word[i] !== guess[i]){
            return false
        } else if (guessResult[i] === 'PRESENT'){
            if (word[i] === guess[i]){
                return false
            } else if (!word.includes(guess[i])){
                return false
            }
        } else if (guessResult[i] === 'ABSENT'){
            let isAbsent = true
            for (let k = 0; k < guess.length; k++){
                if (guess[k] === guess[i] && k !== i && guessResult[k] !== 'ABSENT'){
                    isAbsent = false
                    break
                }
            }
            
            if (isAbsent && word.includes(guess[i])){
                return false
            } else if (!isAbsent && guess[i] === word[i]){
                return false
            }
        }
    }
    
    return true
}
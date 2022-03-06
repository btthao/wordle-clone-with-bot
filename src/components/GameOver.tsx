import React from 'react'

interface GameOverProps {
    onClick: () => void
}

const GameOver: React.FC<GameOverProps> = ({onClick}) => {
    return (
        <div className="game-over">
            <button onClick={onClick}>New Game</button>
        </div>
    );
}

export default GameOver
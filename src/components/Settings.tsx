import React, { useState } from 'react';
import { useStateContext } from '../context';
import MessagePopUp from './MessagePopUp';
import Switch from './Switch';

const Settings: React.FC = () => {
    const [{ darkTheme, hardMode, gameState }, dispatch] = useStateContext();
    const [error, setError] = useState<string|null>(null)
    return (
        <div>
            <h1>SETTINGS</h1>
            <div className="setting">
                <div>
                    <div className="field">Hard Mode</div>
                    <div className="desc">
                        Any revealed hints must be used in subsequent guesses
                    </div>
                </div>
                <div>
                    <Switch isOn={hardMode} 
                    onClick={() => {
                        if (gameState.boardState[0][0] === ''){
                            dispatch({
                                type: "SET_HARD_MODE",
                                payload: !hardMode
                            })
                        } else {
                            setError('Can only be changed before the game starts.')
                            setTimeout(() => {
                                setError(null)
                            }, 1000)
                        }
                    }}
                    />
                </div>
            </div>
            <div className="setting">
                <div>
                    <div className="field">Dark Theme</div>
                </div>
                <div>
                    <Switch isOn={darkTheme}
                    onClick={() => dispatch({
                        type: "SET_DARK_THEME",
                        payload: !darkTheme
                    })}
                    />
                </div>
            </div>
            {error && (
                <MessagePopUp message={error}/>
            )}
        </div>
    );
}

export default Settings
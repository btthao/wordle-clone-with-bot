import React from 'react'

interface SwitchProps {
    isOn: boolean,
    onClick: () => void,
}


const Switch: React.FC<SwitchProps> = ({isOn, onClick}) => {
    return (
        <div onClick={onClick} className={`switch ${isOn ? 'on' : 'off' }`}>
            <span className="knob"></span>
        </div>
    );
}

export default Switch
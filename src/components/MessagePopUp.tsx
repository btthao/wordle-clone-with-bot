import React from 'react'

interface MessagePopUpProps {
     message: string
}

const MessagePopUp: React.FC<MessagePopUpProps> = ({message}) => {
    return (
        <div className="message">
            {message && (
                <h5>{message}</h5>
            )}
        </div>
    );
}

export default MessagePopUp
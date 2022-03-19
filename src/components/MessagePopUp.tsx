import React from 'react'

interface MessagePopUpProps {
     message: string
}

const MessagePopUp: React.FC<MessagePopUpProps> = ({message}) => {
    return (
        <div className="message">
            {message && (
                <p>{message}</p>
            )}
        </div>
    );
}

export default MessagePopUp
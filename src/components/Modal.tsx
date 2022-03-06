import React from 'react';
import { IoClose } from 'react-icons/io5';
import '../styles/Modal.css';
import Settings from './Settings';

interface ModalProps {
    onClick: () => void,
    closing: boolean
}


const Modal: React.FC<ModalProps> = ({onClick, closing}) => {
    return (
        <div className={`modal ${closing ? 'closing' : ''}`}>
            <div className="content">
                <button className='close' onClick={onClick}>
                    <IoClose/>
                </button>
                <Settings/>
            </div>
        </div>
    );
}

export default Modal
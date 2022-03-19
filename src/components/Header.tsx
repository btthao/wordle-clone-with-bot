import React, { useEffect, useState } from 'react';
import { AiFillSetting } from 'react-icons/ai';
import { useStateContext } from '../context';
import HelpBot from './HelpBot';
import Modal from './Modal';


const Header: React.FC = () => {
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [closeModal, setCloseModal] = useState(false)
    const [{ darkTheme }, _] = useStateContext()
    const close = () => {
        setCloseModal(true)
        setTimeout(()=>{
            setModalOpen(false)
            setCloseModal(false)
        }, 150)
    }
    
    // color theme
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", darkTheme ? 'dark' : 'light')
    }, [darkTheme])
   
    return (
        <>
            <header>
                <HelpBot/>
                <div className='title'>WORDLE CLONE</div>
                <button onClick={() => setModalOpen(true)}>
                    <AiFillSetting/>
                </button>  
            </header>
            {modalOpen && <Modal onClick={close} closing={closeModal}/>}
        </>
    );
}

export default Header
import React from 'react'
import { BsQuestionCircle } from 'react-icons/bs';
import { BiBarChartAlt2 } from 'react-icons/bi';
import { AiFillSetting } from 'react-icons/ai';


const Header: React.FC = () => {
    return (
        <header>
            <button>
                <BsQuestionCircle/>
            </button>
            <div className='title'>WORDLE CLONE</div>
            <div>
                <button>
                    <BiBarChartAlt2/>
                </button>
                <button>
                    <AiFillSetting/>
                </button>
            </div>
        </header>
    );
}

export default Header
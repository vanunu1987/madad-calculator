import './Header.scss'
import { ctx } from '../App'
import React ,{ useContext } from 'react';
const Header = () => {
    const { state, dispatch } = useContext(ctx)
    return <div className='header-main-container'>
        <span>שלום :{state.name}</span>
    </div>
} 

export default  Header
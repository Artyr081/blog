import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { username } from '../../redux/selector';

import style from './header.module.scss';

export default function Header() {
    const name = useSelector(username);
    const [userName, setUserName] = useState(name);
    const authorization = localStorage.getItem('token')

    useEffect(() => {
        setUserName(localStorage.getItem('username'))
    }, [name])
    
    function infoClear() {
        localStorage.removeItem('token');
        window.location.reload();
    }


    return (
        <header className={style.header}>
            <Link to='/'>
                <h1 className={style.header__title}>Realworld Blog</h1>
            </Link>
            {authorization ? <div className={style.header__authorization}>
                <Link to='/new-article' className={style.header__button_greenProfile}>Create article</Link>
                <Link to='/profile'>
                    <span className={style.header__name}>{userName}</span>
                    <img  alt='Изображение автора'/></Link>
                <Link to='/' className={style.header__button_profile} onClick={() => infoClear()} >Log Out</Link>
            </div> : <div className={style.header__authorization}>
                <Link to='/sign-in' className={style.header__button}>Sign In</Link>
                <Link to='/sign-up' className={style.header__button_green}>Sign Up</Link>
            </div>
            }
            
        </header>
    )
}
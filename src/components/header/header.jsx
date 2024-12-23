import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar} from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { username, userimage } from '../../redux/selector';

import style from './header.module.scss';

export default function Header() {
    const name = useSelector(username);
    const image = useSelector(userimage);
    const [userName, setUserName] = useState(name);
    const [userImage, setUserImage] = useState(null);
    const authorization = localStorage.getItem('token')

    useEffect(() => {
        setUserName(localStorage.getItem('username'))
        if (localStorage.getItem('image')) {
            setUserImage(localStorage.getItem('image'))
        }
    }, [name, image])
    
    function infoClear() {
        localStorage.removeItem('token');
        localStorage.removeItem('currentPage')
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
                    {userImage ? 
                        <img className={style.author__img} src={userImage} alt='аватарка автора' /> : 
                        <Avatar className={style.author__img} shape="square" size={46} icon={<UserOutlined />} />}
                </Link>
                <Link to='/' className={style.header__button_profile} onClick={() => infoClear()} >Log Out</Link>
            </div> : <div className={style.header__authorization}>
                <Link to='/sign-in' className={style.header__button}>Sign In</Link>
                <Link to='/sign-up' className={style.header__button_green}>Sign Up</Link>
            </div>
            }
            
        </header>
    )
}
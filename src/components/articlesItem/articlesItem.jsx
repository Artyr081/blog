import React, { useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Tag, Alert } from 'antd';

import like from '../../rest/like.svg';
import likeRed from '../../rest/like-red.svg';
import { useLikeArticleMutation, useDisliceArticleMutation } from '../../redux/favoriteArticleApi';

import style from './articlesItem.module.scss';

export default function ArticlesItem({item}) {
    const [errorApi, setErrorApi] = useState('');
    const [buttonDiasbled, setButtonDisabled] = useState(false)
    const isAuth = localStorage.getItem('token');
    const [ disliceArticle] = useDisliceArticleMutation();
    const [ likeArticle] = useLikeArticleMutation();
    const [favorite, setFavorite] = useState(item.favorited);
    const [favoriteCount, setFavoritesCount] = useState(item.favoritesCount)
    
    const hundleClickLike = async () => {
        if (isAuth) {
            try {
                setButtonDisabled(true)
                if (!favorite) {
                    const response = await likeArticle(item.slug).unwrap();
                    setFavorite(true);
                    setFavoritesCount(response.article.favoritesCount); 
                } else {
                    const response = await disliceArticle(item.slug).unwrap(); 
                    setFavorite(false);
                    setFavoritesCount(response.article.favoritesCount);
                }
                setButtonDisabled(false)
            } catch (err) {
                setErrorApi('Произошла ошибка, попробуйте добавить в избранное позже')
                setButtonDisabled(false)
            }
        } else {
            setErrorApi('К сожалению, только авторизованные пользователи могут оценивать посты')
        }
    }

    return (
        <li className={style.articlesItem} key={item.slug}>
            {errorApi && <Alert message={errorApi} type='error' className={style.alert} closable />}
            <Link to={`/articles/${item.slug}`}>
                <h2 className={style.articlesItem__title}>{item.title}</h2>
            </Link>
            <button className={style.articlesItem__liked} onClick={hundleClickLike} disabled={buttonDiasbled}>
                <img className={style.articlesItem__img} src={favorite ? likeRed : like}  alt='лайк'/>
                <span>{favoriteCount}</span>
            </button>
            <div className={style.articlesItem__tag}>{item.tagList.map((element) => <Tag>{element}</Tag>)}</div>
            <p className={style.articlesItem__text}>{item.body}</p>
            <div className={style.author}>
                <span className={style.name}>{item.author.username}</span>
                <span className={style.date}>{format(new Date(`${item.createdAt}`), 'MMMM d, yyyy')}</span>
                <img className={style.img} alt='аватарка автора' src={item.author.image} />
            </div>
        </li>
    )
}
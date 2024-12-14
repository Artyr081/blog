import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Tag, Spin, Alert } from 'antd';
import { format } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';

import { useEditArticleMutation } from '../../redux/editArticleApi';
import { useGetAnArticleApiQuery } from '../../redux/articlesApi';
import { useDeleteArticleMutation } from '../../redux/deleteArticleApi';
import { useLikeArticleMutation, useDisliceArticleMutation } from '../../redux/favoriteArticleApi';
import like from '../../rest/like.svg'
import likeRed from '../../rest/like-red.svg';

import style from './article.module.scss';

export default function Article() {
    const [errorApi, setErrorApi] = useState('');
    const navigate = useNavigate();
    const { slug } = useParams();
    const { data, error, isLoading } = useGetAnArticleApiQuery(slug);
    const [favorite, setFavorite] = useState(false);
    const [favoriteCount, setFavoritesCount] = useState(1)
    const [ editArticle, { isSuccess: isRegistrationSuccess} ] = useEditArticleMutation();
    const [ deleteArticle, { isSuccess: isRegistrationsuccess} ] = useDeleteArticleMutation();
    const [ disliceArticle] = useDisliceArticleMutation();
    const [ likeArticle] = useLikeArticleMutation();
    const isAuth = localStorage.getItem('token');

    useEffect(() => {
        if (data) {
            setFavorite(data.article.favorited);
            setFavoritesCount(data.article.favoritesCount);
        }
    }, [data]);

    if (isRegistrationSuccess) {
        navigate(`/articles/${slug}/edit`, { state: { article: data.article } });
    }

    if (isRegistrationsuccess) {
        navigate('/')
    }

    const hundleEditArticle = async () => {
        try{
            const {title, description, body} = data.article;
            const obj = {
                article: {
                    title,
                    description,
                    body
                },
                slug
            }
            await editArticle(obj).then((res) => res.data)
        }catch(err) {
            setErrorApi('Произошла ошибка, попробуйте позже')
        }
    }

    const hundleDeleteArticle = async () => {
        try{
            await deleteArticle(slug)
        }catch(err) {
            setErrorApi('Произошла ошибка при попытке удаления статьи, попробуйте позже')
            
        }
    }

    const hundleClickLike = async () => {
        if (isAuth) {
            try {
                if (!favorite) {
                    const response = await likeArticle(slug).unwrap();
                    setFavorite(true);
                    setFavoritesCount(response.article.favoritesCount); 
                } else {
                    const response = await disliceArticle(slug).unwrap(); 
                    setFavorite(false);
                    setFavoritesCount(response.article.favoritesCount);
                }
            } catch (err) {
                setErrorApi('Произошла ошибка, попробуйте добавить в избранное позже')
            }
        } else {
            setErrorApi('К сожалению, только авторизованные пользователи могут оценивать посты')
        }
    }

    const isAuthName = localStorage.getItem('username');
    
    if (error) return <h1>Ошибка</h1>
    if (isLoading) return <Spin className={style.spin} />

    return (
        <section className={style.article}>
            {errorApi && <Alert message={errorApi} type='error' className={style.alert} closable />}
            <h3 className={style.article__title}>{data.article.title}</h3>
            <button className={style.article__liked} onClick={hundleClickLike}>
                <img className={style.article__img} src={favorite ? likeRed : like}  alt='лайк'/>
                <span>{favoriteCount}</span>
            </button>
            {isAuth && isAuthName === data.article.author.username && <button className={style.author__delete} 
                onClick={hundleDeleteArticle}>Delete</button>}
            {isAuth && isAuthName === data.article.author.username && <button className={style.author__edit} 
                onClick={hundleEditArticle}>Edit</button>}
            <div className={style.author}>
                <span className={style.author__name}>{data.article.author.username}</span>
                <span className={style.author__date}>
                    {format(new Date(`${data.article.createdAt}`), 'MMMM d, yyyy')}
                </span>
                <img className={style.author__img} src={data.article.author.image} alt='аватарка автора' />
            </div>
            <div className={style.author__tag}>{data.article.tagList.map((element) => <Tag>{element}</Tag>)}</div>
            <p className={style.author__text}>{data.article.description}</p>
            <p className={style.author__text}>
                <Markdown>
                    {data.article.body}
                </Markdown>
            </p>
        </section>
    )
}
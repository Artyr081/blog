import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Tag, Spin, Alert, Avatar, Popconfirm } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setArticleInfo } from '../../redux/articleInfo';
import { useEditArticleMutation } from '../../redux/editArticleApi';
import { useGetAnArticleApiQuery } from '../../redux/articlesApi';
import { useDeleteArticleMutation } from '../../redux/deleteArticleApi';
import { useLikeArticleMutation, useDisliceArticleMutation } from '../../redux/favoriteArticleApi';
import like from '../../rest/like.svg'
import likeRed from '../../rest/like-red.svg';

import style from './article.module.scss';


export default function Article() {
    const [errorApi, setErrorApi] = useState('');
    const [buttonDiasbled, setButtonDisabled] = useState(false)
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { slug } = useParams();
    const { data, error, isLoading } = useGetAnArticleApiQuery(slug, {refetchOnMountOrArgChange: true});
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
        navigate(`/articles/${slug}/edit`);
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
            setButtonDisabled(true)
            const result = await editArticle(obj).then((res) => res.data)
            dispatch(setArticleInfo(result))
            setButtonDisabled(false)
        }catch(err) {
            setErrorApi('Произошла ошибка, попробуйте позже')
            setButtonDisabled(false)
        }
    }

    const hundleDeleteArticle = async () => {
        try{
            setButtonDisabled(true)
            await deleteArticle(slug)
            setButtonDisabled(false)
        }catch(err) {
            setErrorApi('Произошла ошибка при попытке удаления статьи, попробуйте позже')
            setButtonDisabled(false)
            
        }
    }

    const hundleClickLike = async () => {
        if (isAuth) {
            try {
                setButtonDisabled(true)
                if (!favorite) {
                    const response = await likeArticle(slug).unwrap();
                    setFavorite(true);
                    setFavoritesCount(response.article.favoritesCount); 
                } else {
                    const response = await disliceArticle(slug).unwrap(); 
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
            setButtonDisabled(false)
        }
    }

    const isAuthName = localStorage.getItem('username');
    
    if (error) return <h1>Ошибка</h1>
    if (isLoading) return <Spin className={style.spin} />

    return (
        <section className={style.article}>
            {errorApi && <Alert message={errorApi} type='error' className={style.alert} closable />}
            <h3 className={style.article__title}>{data.article.title}</h3>
            <button className={style.article__liked} onClick={hundleClickLike} disabled={buttonDiasbled}>
                <img className={style.article__img} src={favorite ? likeRed : like}  alt='лайк'/>
                <span>{favoriteCount}</span>
            </button>
            {isAuth && isAuthName === data.article.author.username && <Popconfirm title='Hello world' 
                open={visible}
                onConfirm={hundleDeleteArticle}
                onCancel={() => setVisible(false)}>
                <button className={style.author__delete} type='primary'
                    onClick={() => setVisible(true)} disabled={buttonDiasbled}>Delete</button>
            </Popconfirm>}
            {isAuth && isAuthName === data.article.author.username && <button className={style.author__edit} 
                onClick={hundleEditArticle} disabled={buttonDiasbled}>Edit</button>}
            <div className={style.author}>
                <span className={style.author__name}>{data.article.author.username}</span>
                <span className={style.author__date}>
                    {format(new Date(`${data.article.createdAt}`), 'MMMM d, yyyy')}
                </span>
                {data.article.author.image ? 
                    <img className={style.author__img} src={data.article.author.image} alt='аватарка автора' /> : 
                    <Avatar className={style.author__img} shape="square" size={46} icon={<UserOutlined />} />}
            </div>
            <div className={style.author__tag}>{data.article.tagList.map((element) => <Tag>{element}</Tag>)}</div>
            <p className={style.author__text}>{data.article.description}</p>
            <Markdown className={style.author__text}>
                {data.article.body}
            </Markdown>
        </section>
    )
}
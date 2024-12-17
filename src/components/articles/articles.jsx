import React, { useState } from 'react';
import { Pagination, Spin, Alert } from 'antd';

import { useGetArticleApiQuery } from '../../redux/articlesApi';
import ArticlesItem from '../articlesItem';

import style from './articles.module.scss';

export default function Articles() {
    const [current, setCurrent] = useState(
        localStorage.getItem('currentPage') ? localStorage.getItem('currentPage') : 1
    );
    const { data, isLoading, error } = useGetArticleApiQuery(current, {refetchOnMountOrArgChange: true});
    const  currentPage = (page) => {
        setCurrent(page);
        localStorage.setItem('currentPage', page)
    }
    
    if (error) return <Alert type='warning' message='Произошла ошибка, попробуйте позже'/>
    if (isLoading) return <Spin className={style.spin} />
    return (
        <section className={style.articles}>
            <ul className={style.articles__list}>
                {data.articles.map((item) => (
                    <ArticlesItem item={item} key={item.slug}/>
                ))}
            </ul>
            <Pagination current={current} total={50} className={style.pagination} 
                onChange={currentPage}/>
        </section>
    )
}
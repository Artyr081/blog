import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from '../header/index';
import Articles from '../articles/index';
import Article from '../article/index';
import SignUp from '../signUp';
import SignIn from '../signIn';
import EditProfile from '../editProfile';
import CreateArticle from '../createArticle';
import EditArticle from '../editArticle/editArticle';
import PrivatRouter from '../privatRouter';

import style from './app.module.scss';

export default function App() {
    
    return (
        <>
            <Header />
            <main className={style.main}>
                <Routes>
                    <Route path='/' element={ <Articles /> } />
                    <Route path='/articles' element={ <Articles /> } />
                    <Route path='/articles/:slug' element={ <Article /> } />
                    <Route path='/articles/sign-in' element={ <Article /> } />
                    <Route path='/sign-up' element={ <SignUp /> } />
                    <Route path='/sign-in' element={ <SignIn /> } />
                    <Route path='/profile' element={ <EditProfile /> } />
                    <Route element={ <PrivatRouter /> }>
                        <Route path='/new-article' element={ <CreateArticle /> } />
                    </Route>
                    <Route path='/articles/:slug/edit'  element={ <EditArticle /> }/>
                </Routes>
            </main>
        </>
    )
}
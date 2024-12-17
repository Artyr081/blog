import { configureStore } from '@reduxjs/toolkit';

import articlesApi from './articlesApi';
import usersApi from './usersApi';
import userInfo from './userInfo';
import articleInfo from './articleInfo';
import loginUserApi from './loginUserApi';
import articleApi from './createArticleApi';
import editArticleApi from './editArticleApi';
import deleteArticleApi from './deleteArticleApi';
import favoriteArticleApi from './favoriteArticleApi';

const store = configureStore({
    reducer: {
        userInfo,
        articleInfo,
        [articlesApi.reducerPath]: articlesApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [loginUserApi.reducerPath]: loginUserApi.reducer,
        [articleApi.reducerPath]: articleApi.reducer,
        [editArticleApi.reducerPath]: editArticleApi.reducer,
        [deleteArticleApi.reducerPath]: deleteArticleApi.reducer,
        [favoriteArticleApi.reducerPath]: favoriteArticleApi.reducer,
        
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
            .concat(articlesApi.middleware)
            .concat(usersApi.middleware)
            .concat(loginUserApi.middleware)
            .concat(articleApi.middleware)
            .concat(editArticleApi.middleware)
            .concat(deleteArticleApi.middleware)
            .concat(favoriteArticleApi.middleware)
})

export default store;
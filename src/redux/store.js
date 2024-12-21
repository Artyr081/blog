import { configureStore } from '@reduxjs/toolkit';

import usersApi from './usersApi';
import userInfo from './userInfo';
import articleInfo from './articleInfo';
import articlesApi from './articlesApi';

const store = configureStore({
    reducer: {
        userInfo,
        articleInfo,
        [usersApi.reducerPath]: usersApi.reducer,
        [articlesApi.reducerPath]: articlesApi.reducer,
        
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
            .concat(usersApi.middleware)
            .concat(articlesApi.middleware)
})

export default store;
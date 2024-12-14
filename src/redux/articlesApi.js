import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const articlesApi = createApi({
    reducerPath: 'articlesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://blog-platform.kata.academy/api',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')
            if (token) {
                headers.set('Authorization', `Token ${token}`);
                headers.set('Content-Type', 'application/json');
            }
            return headers;
        },
    }),
    endpoints: (build) => ({
        getArticleApi: build.query({
            query: (offset = null) => {
                if (offset === 1) return `/articles?limit=5&offset=${offset}`
                if (offset >= 2) return `/articles?limit=5&offset=${offset * 5 - 5}`
                return `/articles?limit=5&offset=${offset}`
            },
        }),
        getAnArticleApi: build.query({
            query: (slug) => `/articles/${slug}`
        })
    })
})

export const { useGetArticleApiQuery, useGetAnArticleApiQuery } = articlesApi;
export default articlesApi;
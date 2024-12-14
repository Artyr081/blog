import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const articleApi = createApi({
    reducerPath: 'createArticleApi',
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
    endpoints: (builder) => ({
        createNewArticle: builder.mutation({
            query: (article) => ({
                url: '/articles',
                method: 'POST',
                body: { article },
            }),
        })
    })
})

export const { useCreateNewArticleMutation } = articleApi;
export default articleApi;
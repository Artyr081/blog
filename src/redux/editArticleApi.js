import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const editArticleApi = createApi({
    reducerPath: 'editArticleApi',
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
        editArticle: builder.mutation({
            query: ({ article, slug }) => ({
                url: `articles/${slug}`,
                method: 'PUT',
                body: { article },
            }),
        })
    })
})

export const { useEditArticleMutation } = editArticleApi;
export default editArticleApi;
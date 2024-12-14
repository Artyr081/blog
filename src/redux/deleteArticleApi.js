import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const deleteArticleApi = createApi({
    reducerPath: 'deleteArticleApi',
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
        deleteArticle: builder.mutation({
            query: (slug) => ({
                url: `articles/${slug}`,
                method: 'DELETE',
            }),
        })
    })
})

export const { useDeleteArticleMutation } = deleteArticleApi;
export default deleteArticleApi;
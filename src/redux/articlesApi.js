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
    tagTypes: ['Articles'],
    endpoints: (builder) => ({
        getArticleApi: builder.query({
            query: (offset = null) => {
                if (offset === 1) return `/articles?limit=5&offset=${offset}`
                if (offset >= 2) return `/articles?limit=5&offset=${offset * 5 - 5}`
                return `/articles?limit=5&offset=${offset}`
            },
            providesTags: ['Articles'],
        }),
        getAnArticleApi: builder.query({
            query: (slug) => `/articles/${slug}`
        }),
        deleteArticle: builder.mutation({
            query: (slug) => ({
                url: `articles/${slug}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Articles'],
        }),
        createNewArticle: builder.mutation({
            query: (article) => ({
                url: '/articles',
                method: 'POST',
                body: { article },
            }),
            invalidatesTags: ['Articles'],
        }),
        editArticle: builder.mutation({
            query: ({ article, slug }) => ({
                url: `articles/${slug}`,
                method: 'PUT',
                body: { article },
            }),
            invalidatesTags: ['Articles'],
        }),
        likeArticle: builder.mutation({
            query: (slug) => ({
                url: `/articles/${slug}/favorite`,
                method: 'POST',
            }),
            invalidatesTags: ['Articles'],
        }),
        disliceArticle: builder.mutation({
            query: (slug) => ({
                url: `/articles/${slug}/favorite`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Articles'],
        })
    })
})

export const { useGetArticleApiQuery, useGetAnArticleApiQuery, useDeleteArticleMutation,
    useCreateNewArticleMutation, useEditArticleMutation, useLikeArticleMutation,
    useDisliceArticleMutation,} = articlesApi;
export default articlesApi;
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://blog-platform.kata.academy/api',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')
            if (token) {
                headers.set('Authorization', `Token ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (build) => ({
        createUser: build.mutation({
            query: (data) => ({
                url: '/users',
                method: 'POST',
                body: { user: data },
            }),
            transformResponse: (res) => {
                localStorage.setItem('token', res.user.token);
                return res;
            }
        }),
        loginUser: build.mutation({
            query: (data) => ({
                url: '/users/login',
                method: 'POST',
                body: { user: data },
            }),
            transformResponse: (res) => {
                localStorage.setItem('token', res.user.token);
                return res;
            }
        }),
        editProfile: build.mutation({
            query: (data) => ({
                url: '/user',
                method: 'PUT',
                body: { user: data },
            }),
        })
    })
})

export const { useCreateUserMutation, useLoginUserMutation, useEditProfileMutation } = usersApi;
export default usersApi;
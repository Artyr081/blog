import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const loginUserApi = createApi({
    reducerPath: 'loginUserApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://blog-platform.kata.academy/api',
    }),
    endpoints: (build) => ({
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
        })
    })
})

export const { useLoginUserMutation } = loginUserApi;
export default loginUserApi;
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://blog-platform.kata.academy/api',
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
        })
    })
})

export const { useCreateUserMutation } = usersApi;
export default usersApi;
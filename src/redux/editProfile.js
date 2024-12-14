import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const editProfileApi = createApi({
    reducerPath: 'editProfileApi',
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
        editProfile: build.mutation({
            query: (data) => ({
                url: '/user',
                method: 'PUT',
                body: { user: data },
            }),
        })
    })
})

export const { useEditProfileMutation } = editProfileApi;
export default editProfileApi;
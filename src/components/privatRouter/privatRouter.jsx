import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivatRouter()  {
    const auth = localStorage.getItem('token')

    return (
        auth ? <Outlet /> : <Navigate to='/sign-in' />
    )
}
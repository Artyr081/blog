import React, { useState} from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setLoginrUser } from '../../redux/userInfo';
import { useLoginUserMutation } from '../../redux/usersApi';

import style from './signIn.module.scss';

export default function SignIn() {
    const [error, setError] = useState('')
    const [buttonDiasbled, setButtonDisabled] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginUserApi, { isSuccess: isRegistrationSuccess,}] = useLoginUserMutation();

    if (isRegistrationSuccess) {
        navigate('/');
    }
    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm();

    const onSubmit = async (data) => {
        const { emailAddres, password} = data;
        const obj = {
            email: emailAddres,
            password
        }
        
        try {
            setButtonDisabled(true)
            const datas = await loginUserApi(obj).then(res => res.data);
            dispatch(setLoginrUser(datas))
            setButtonDisabled(false)

        }catch(err) {
            setError('Проверьте введенные данные и повторите попытку входа')
            setButtonDisabled(false)
        }
    }

    return (
        <section className={style.sign}>
            <h4 className={style.title}>Sign In</h4>
            {error && <p className={style.error}>{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <label className={style.label}>
                    Email address:
                    <input className={style.input} placeholder="Email addres" {...register('emailAddres', {
                        required: 'Поле обезательно к заполнению',
                        minLength: {
                            value: 5,
                            message: 'минимум 5 символов'
                        },
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: 'некорректный адрес почты',
                        },
                    })} />
                    {errors?.emailAddres?.message && (
                        <p className={style.error}>{errors?.emailAddres?.message}</p>
                    )}
                </label>
                <label className={style.label}>
                    Password:
                    <input type='password' className={style.input} placeholder="Password" {...register('password', {
                        required: 'Поле обезательно к заполнению',
                        minLength: {
                            value: 6,
                            message: 'должно быть минимум 6 символов'
                        },
                        maxLength: {
                            value: 40,
                            message: 'должно быть не больше 40 символов'
                        },
                    })} />
                    {errors?.password?.message && (
                        <p className={style.error}>{errors?.password?.message}</p>
                    )}
                </label>
                <input className={style.submit} type='submit' value='Login' disabled={buttonDiasbled} />
            </form>
            <div className={style.sign__in}>
                <p>Already have an account?<Link className={style.sign__inLink} to='/sign-up'>Sign Up</Link>.</p>
            </div>
        </section>
    )
}
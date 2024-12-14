import React, { useState} from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setRegisterUserInfo } from '../../redux/userInfo';
import { useCreateUserMutation} from '../../redux/usersApi';

import style from './signUp.module.scss';

export default function SignUp() {
    const [errorUsername, setErrorUserName] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [createUser, { isSuccess: isRegistrationSuccess}] = useCreateUserMutation();

    if (isRegistrationSuccess) {
        navigate('/');
    }

    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        watch
    } = useForm({
        mode:'onBlur',
        validate: {
            Password: (value) => {
                const { RepeatPassword } = value;
                return RepeatPassword === value || 'Пароли не совпадают';
            },
            checkbox: {
                required: 'нужно поставить галочку',
            },
        },
    });

    const password = watch('Password');

    const onSubmit = async (data) => {
        const { Username, EmailAddres, Password} = data;
        const obj = {
            username: Username,
            email: EmailAddres,
            password: Password
        }
        
        try {
            await createUser(obj).unwrap();
            dispatch(setRegisterUserInfo(data))

        }catch(err) {
            if(err.status === 422) {
                if (err.data.errors.username) {
                    setErrorUserName('Данное имя уже занято, попробуйте ввести другое имя')
                }
                if (err.data.errors.email) {
                    setErrorEmail('Пользователь с таким адресом электронной почты уже зарегистрирован')
                }
            } else {
                setError('Произшла ошибка, попробуйте позже')
            }
        }
    }

    return (
        <section className={style.sign}>
            <h4 className={style.title}>Create new account</h4>
            {error && <p className={style.error}>{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <label className={style.label}>
                    Username:
                    <input className={style.input} placeholder="Username" {...register('Username', {
                        required: 'Поле обезательно к заполнению',
                        minLength: {
                            value: 3,
                            message: 'должно быть минимум 3 символов'
                        },
                        maxLength: {
                            value: 20,
                            message: 'должно быть не больше 20 символов'
                        },
                    })} />
                    {errors?.Username?.message && (
                        <p className={style.error}>{errors?.Username?.message}</p>
                    )}
                    {errorUsername && <p className={style.error}>{errorUsername}</p>}
                </label>
                <label className={style.label}>
                    Email address:
                    <input type='email' className={style.input} 
                        placeholder="Email addres" {...register('EmailAddres', {
                            required: 'Поле обезательно к заполнению',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: 'некорректный адрес почты',
                            },
                        })} 
                    />
                    {errors?.EmailAddres?.message && (
                        <p className={style.error}>{errors?.EmailAddres?.message}</p>
                    )}
                    {errorEmail && <p className={style.error}>{errorEmail}</p>}
                </label>
                <label className={style.label}>
                    Password:
                    <input type='password' className={style.input} placeholder="Password" {...register('Password', {
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
                    {errors?.Password?.message && (
                        <p className={style.error}>{errors?.Password?.message}</p>
                    )}
                </label>
                <label className={style.label}>
                    Repeat Password:
                    <input type='password' className={style.input} 
                        placeholder="Repeat Password" {...register('RepeatPassword', {
                            required: 'Поле обезательно к заполнению',
                            minLength: {
                                value: 6,
                                message: 'должно быть минимум 6 символов'
                            },
                            maxLength: {
                                value: 40,
                                message: 'должно быть не больше 40 символов'
                            },
                            validate: value => value === password || 'Пароли не совпадают'
                        })} 
                    />
                    {errors?.RepeatPassword?.message && (
                        <p className={style.error}>{errors?.RepeatPassword?.message}</p>
                    )}
                </label>
                <label className={style.label__text}>
                    <input className={style.checkbox} type='checkbox' {...register('checkbox', {
                        required: 'нужно поставить галочку',
                    })} />
                    <p className={style.checkbox__text}>I agree to the processing of my personal information</p>
                </label>
                {errors?.checkbox?.message && (
                    <p className={style.error}>{errors?.checkbox?.message}</p>
                )}
                <input className={style.submit} type='submit' value='Create' disabled={!isValid} />
            </form>
            <div className={style.sign__in}>
                <p>Already have an account?<Link className={style.sign__inLink} to='/sign-in'>Sign In</Link>.</p>
            </div>
        </section>
    )
}
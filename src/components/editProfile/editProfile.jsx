import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { Alert } from 'antd';

import { setEditProfile } from '../../redux/userInfo';
import { useEditProfileMutation } from '../../redux/usersApi';

import style from './editProfile.module.scss';

export default function EditProfile() {
    const[errorApi, setErrorApi] = useState('');
    const [buttonDiasbled, setButtonDisabled] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userNames = localStorage.getItem('username');
    const useEmails = localStorage.getItem('emailaddres');
    const userImage = localStorage.getItem('image')
    const [editProfileApi] = useEditProfileMutation();
    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue
    } = useForm({
        mode:'onBlur',
    });

    useEffect(() => {
        setValue('Username', userNames);
        setValue('EmailAddres', useEmails);
        setValue('avatarImage', userImage)
    }, [userNames, useEmails, userImage, setValue]);

    const onSubmit = async (data) => {
        const { EmailAddres, Password, Username, avatarImage} = data;
        const obj = {
            email: EmailAddres,
            password: Password,
            username: Username,
            avatarImage,
        }
        localStorage.setItem('image', avatarImage)
        
        try {
            setButtonDisabled(true)
            const datas = await editProfileApi(obj).then(res => res.data)
            dispatch(setEditProfile(datas))
            setButtonDisabled(false)
            navigate('/')

        }catch(err) {
            setErrorApi('Произошла ошибка, попробуйте позже')
            setButtonDisabled(false)
        }
    }

    return (
        <section className={style.edit}>
            <h4 className={style.title}>Edit Profile</h4>
            {errorApi && <Alert message={errorApi} type='error' className={style.alert} closable />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <label className={style.label}>
                    Username:
                    <input className={style.input} placeholder={userNames} {...register('Username', {
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
                </label>
                <label className={style.label}>
                    Email address:
                    <input type='email' className={style.input} 
                        placeholder={useEmails} {...register('EmailAddres', {
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
                </label>
                <label className={style.label}>
                    New password:
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
                    Avatar image (url):
                    <input  className={style.input} 
                        placeholder={userImage} {...register('avatarImage')} 
                    />
                </label>
                <input className={style.save} type='submit' value='Save' disabled={buttonDiasbled} />
            </form>
        </section>
    )
}
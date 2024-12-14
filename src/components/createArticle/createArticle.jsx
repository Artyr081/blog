import React, { useState} from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'antd';

import { useCreateNewArticleMutation } from '../../redux/createArticleApi';

import style from './createArticle.module.scss';

export default function CreateArticle() {
    const [errorApi, setErrorApi] = useState('');
    const [field, setField] = useState([{id: 1, tag: ''}]);
    const navigate = useNavigate();
    const [ createNewArticle, { isSuccess: isRegistrationSuccess,} ] = useCreateNewArticleMutation();
    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm();

    if (isRegistrationSuccess) {
        navigate('/')
    }

    const onSubmit = async (data) => {
        const tags = field.map(item => item.tag);
        try {
            await createNewArticle({
                title: data.title,
                description: data.shortDescription,
                body: data.text,
                tagList: tags,
            });
        }catch(err) {
            setErrorApi('Произошла ошибка при создание новой статьи, попробуйте позже')
        }
    }

    const createFiled = () => {
        setField([...field, {id: field.length + 1, tag: ''}])
    }

    const deleteField = (e, id) => {
        e.preventDefault();
        const newField = field.filter((item, index) => index !== id);
        setField(newField);
    }

    const changeInput = (index, value) => {
        const newFields = [...field];
        newFields[index].tag = value;
        setField(newFields);
    }


    return (
        <section className={style.create}>
            <h3 className={style.create__title}>Create new article</h3>
            {errorApi && <Alert message={errorApi} type='error' className={style.alert} closable />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <label className={style.label}>
                    Title
                    <input className={style.input} placeholder="Title" {...register('title', {
                        required: 'Поле обезательно к заполнению',
                        minLength: {
                            value: 3,
                            message: 'минимум 3 символов'
                        },
                    })} />
                    {errors?.title?.message && (
                        <p className={style.error}>{errors?.title?.message}</p>
                    )}
                </label>
                <label className={style.label}>
                    Short description
                    <input className={style.input} placeholder="Title" {...register('shortDescription', {
                        required: 'Поле обезательно к заполнению',
                        minLength: {
                            value: 3,
                            message: 'минимум 3 символов'
                        },
                    })} />
                    {errors?.shortDescription?.message && (
                        <p className={style.error}>{errors?.shortDescription?.message}</p>
                    )}
                </label>
                <label className={style.label}>
                    Text
                    <textarea className={style.input__text} placeholder="Text" {...register('text', {
                        required: 'Поле обезательно к заполнению',
                        minLength: {
                            value: 3,
                            message: 'минимум 3 символов'
                        },
                    })} />
                    {errors?.text?.message && (
                        <p className={style.error}>{errors?.text?.message}</p>
                    )}
                </label>
                <label className={style.label}>
                    Tags
                    <ul>
                        {field.map((item, index) => (
                            <li className={style.input__list} key={item.id} >
                                <input className={style.input__tags} 
                                    placeholder="Tag" {...register(`tags ${item.id}`)}
                                    onChange={(e) => changeInput(index, e.target.value)} />
                                <button className={style.input__button_delete} 
                                    onClick={(e) => deleteField(e, index)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    {errors?.tags?.message && (
                        <p className={style.error}>{errors?.tags?.message}</p>
                    )}
                </label>
                <input className={style.submit} type='submit' value='Send' />
            </form>
            <button className={style.input__button_addTag} onClick={createFiled}>Add tag</button>
        </section>
    )
}
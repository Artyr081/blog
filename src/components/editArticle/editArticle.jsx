import React, { useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'antd';
import { useSelector } from 'react-redux';

import { articleInfo } from '../../redux/selector';
import { useCreateNewArticleMutation } from '../../redux/articlesApi';

import style from './editArticle.module.scss';

export default function EditArticle() {
    const [errorApi, setErrorApi] = useState('');
    const [buttonDiasbled, setButtonDisabled] = useState(false)
    const navigate = useNavigate();
    const article = useSelector(articleInfo);
    const [field, setField] = useState([]);
    const [ createNewArticle] = useCreateNewArticleMutation();
    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm({
        defaultValues: {
            title: article.title,
            shortDescription: article.description,
            text: article.body,
        }
    });
    
    useEffect(() => {
        if(article && article.tagList) {
            setField(article.tagList.map((tag, index) => ({ id: index + 1, tag })))
        }
    }, [article]);

    const onSubmit = async (data) => {
        const tags = field.map(item => item.tag);
        try {
            setButtonDisabled(true)
            const response = await createNewArticle({
                title: data.title,
                description: data.shortDescription,
                body: data.text,
                tagList: tags,
            });
            navigate(`/articles/${response.data.article.slug}`)
            setButtonDisabled(false)
        }catch(err) {
            setButtonDisabled(false)
            setErrorApi(setErrorApi('Произошла ошибка, попробуйте позже'))
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
        newFields[index] = { ...newFields[index], tag: value }; 
        setField(newFields);
    }

    return (
        <section className={style.create}>
            <h3 className={style.create__title}>Edit article</h3>
            {errorApi && <Alert message={errorApi} type='error' className={style.alert} closable />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <label className={style.label}>
                    Title
                    <input className={style.input} placeholder='Title'
                    
                        {...register('title', {
                            required: 'Поле обезательно к заполнению',
                            minLength: {
                                value: 3,
                                message: 'минимум 3 символов'
                            },
                        })} 
                    />
                    {errors?.title?.message && (
                        <p className={style.error}>{errors?.title?.message}</p>
                    )}
                </label>
                <label className={style.label}>
                    Short description
                    <input className={style.input} placeholder='Title' 
                    
                        {...register('shortDescription', {
                            required: 'Поле обезательно к заполнению',
                            minLength: {
                                value: 3,
                                message: 'минимум 3 символов'
                            },
                        })} 
                    />
                    {errors?.shortDescription?.message && (
                        <p className={style.error}>{errors?.shortDescription?.message}</p>
                    )}
                </label>
                <label className={style.label}>
                    Text
                    <textarea className={style.input__text} placeholder='Text'
                    
                        {...register('text', {
                            required: 'Поле обезательно к заполнению',
                            minLength: {
                                value: 3,
                                message: 'минимум 3 символов'
                            },
                        })} 
                    />
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
                                    placeholder='Tag'
                                    value={item.tag}
                                    {...register(`tags${index}`)}
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
                <input className={style.submit} type='submit' value='Send' disabled={buttonDiasbled} />
            </form>
            <button className={style.input__button_addTag} onClick={createFiled}>Add tag</button>
        </section>
    )
}
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'antd';

import { useCreateNewArticleMutation } from '../../redux/articlesApi';

import style from './createArticle.module.scss';

export default function CreateArticle() {
    const [errorApi, setErrorApi] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [fields, setFields] = useState([{ id: 1, tag: '' }]);
    const navigate = useNavigate();
    const [createNewArticle] = useCreateNewArticleMutation();
    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm();

    const onSubmit = async (data) => {
        const tags = fields.map(field => field.tag);
        try {
            setButtonDisabled(true);
            const response = await createNewArticle({
                title: data.title,
                description: data.shortDescription,
                body: data.text,
                tagList: tags
            }).unwrap();
            navigate(`/articles/${response.article.slug}`);
        } catch (error) {
            setErrorApi('Произошла ошибка при создании новой статьи, попробуйте позже');
        }
        setButtonDisabled(false);
    };

    const addField = () => {
        const newFields = [...fields, { id: fields.length + 1, tag: '' }];
        setFields(newFields);
    };

    const deleteField = (index) => {
        const newFields = fields.filter((field, i) => i !== index);
        setFields(newFields);
    };

    const handleChange = (index, value) => {
        const newFields = [...fields];
        newFields[index].tag = value;
        setFields(newFields);
    };

    return (
        <section className={style.create}>
            <h3 className={style.create__title}>Create new article</h3>
            {errorApi && <Alert message={errorApi} type="error" className={style.alert} />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <label className={style.label}>
                    Title
                    <input className={style.input} placeholder="Title" 
                        {...register('title', { required: 'Поле обязательно к заполнению' })} />
                    {errors.title && <p className={style.error}>{errors.title.message}</p>}
                </label>
                <label className={style.label}>
                    Short description
                    <input className={style.input} placeholder="Short Description" 
                        {...register('shortDescription', { required: 'Поле обязательно к заполнению' })} />
                    {errors.shortDescription && <p className={style.error}>{errors.shortDescription.message}</p>}
                </label>
                <label className={style.label}>
                    Text
                    <textarea className={style.input__text} placeholder="Text" 
                        {...register('text', { required: 'Поле обязательно к заполнению' })} />
                    {errors.text && <p className={style.error}>{errors.text.message}</p>}
                </label>
                <label className={style.label}>
                    Tags
                    <ul>
                        {fields.map((field, index) => (
                            <li className={style.input__list} key={field.id}>
                                <input
                                    className={style.input__tags}
                                    placeholder="Tag"
                                    value={field.tag}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                />
                                <button className={style.input__button_delete} 
                                    onClick={() => deleteField(index)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    {errors.tags && <p className={style.error}>{errors.tags.message}</p>}
                </label>
                <input className={style.submit} type="submit" value="Send" disabled={buttonDisabled} />
            </form>
            <button className={style.input__button_addTag} onClick={addField}>Add Tag</button>
        </section>
    );
}
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    article: {},
}

export const articleInfo = createSlice({
    name: 'articleInfo',
    initialState,
    reducers: {
        setArticleInfo(state, action) {
            state.article = action.payload.article
        }
    },
    
})

export const { setArticleInfo } = articleInfo.actions;

export default articleInfo.reducer;
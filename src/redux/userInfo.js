import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: '',
    emailaddres: '',
    password: '',
    repeatpassword: '',
    image: '',
    checkbox: null,
    authorization: null,
}

export const userInfo = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setRegisterUserInfo(state, action) {
            state.username = action.payload.Username;
            localStorage.setItem('username', action.payload.Username)

            state.emailaddres = action.payload.EmailAddres;
            localStorage.setItem('emailaddres', action.payload.EmailAddres)

            state.password = action.payload.Password;
            state.repeatpassword = action.payload.RepeatPassword;
            state.checkbox = action.payload.checkbox;
            state.authorization = true;
        },
        setLoginrUser(state, action) {
            state.username = action.payload.user.username;
            localStorage.setItem('username', action.payload.user.username)
    
            state.emailaddres = action.payload.user.email;
            localStorage.setItem('emailaddres', action.payload.user.email)

            state.password = action.payload.user.Password;
            state.authorization = true;
        },
        setEditProfile(state, action) {
            state.username = action.payload.user.username;
            localStorage.setItem('username',action.payload.user.username)

            state.emailaddres = action.payload.user.email;
            localStorage.setItem('emailaddres', action.payload.user.email)
        
            state.password = action.payload.user.password;
            state.image = action.payload.user.avatarImage;
            state.authorization = true;
        }
    },
    
})

export const { setRegisterUserInfo, setLoginrUser, setEditProfile } = userInfo.actions;

export default userInfo.reducer;

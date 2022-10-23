import style from './loginPage.module.css'
import React from 'react'
import {useNavigate} from 'react-router-dom'

export default function LoginPage() {

    const navigate = useNavigate()

    interface User{
        username: string;
        password: string;
    }

    function login():void {
        navigate('/');
    }

    function register():void{
        navigate('/register')
    }

    return <div className={style['container']}>
        <image className={style['avatar']}></image>

        <input className={style['username']} placeholder='Username'></input>
        <input className={style['password']} placeholder='Password' type={'password'}></input>

        <div className={style['login-btn']} onClick={login}>LOG IN</div>
        <div className={style['switch-account-btn']} onClick={register}>Register</div>
    </div>
}



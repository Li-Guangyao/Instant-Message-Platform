import style from './registrationPage.module.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

function RegistrationPage() {

    const isVerified = false;
    const navigate = useNavigate()

    interface User {
        username: string;
        password: string;
    }

    function login(): void {
        navigate('/');
    }

    function goBack() {
        navigate(-1);
    }

    function sendCode() {

    }

    function regisgter() {
        axios.post('http://127.0.0.1:8081/register', {
            interface: 'register',
            liguangyao: 'name',
            age: 56
        }).then(res => {
            console.log('res',res)
        }
        ).catch(err => {
            console.log('err',err)
        })
    }

    return <div className={style['container']}>
        {isVerified ?
            <div className={style['input-information']}>
                <image className={style['avatar']}></image>

                <input className={style['username']} placeholder='Username'></input>
                <input className={style['password']} placeholder='Password' type={'password'}></input>
                <input className={style['reinput-password']} placeholder='Reinput Password' type={'password'}></input>

                <div className={style['login-btn']} onClick={login}>Log In</div>
                <div className={style['switch-account-btn']} onClick={goBack}>Go Back</div>
            </div> :
            <div className={style['email-varification']}>
                <div>
                    <input className={style['email-input']} type='email' placeholder='example@domain.xxx'></input>
                    <div className={style['status-sign']}>Yes</div>
                    <button className={style['send-code-btn']} onClick={sendCode}>Send a Code</button>
                </div>
                <div>
                    <input className={style['verification-code']}></input>
                    <div className={style['status-sign']}>Yes</div>
                </div>
                <button className={style['register-btn']} onClick={regisgter}>Register an Account</button>
                <div className={style['switch-account-btn']} onClick={goBack}>Go Back</div>
            </div>
        }
    </div>
};

export default RegistrationPage;
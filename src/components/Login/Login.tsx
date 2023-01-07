import React from "react";
import { Link } from "react-router-dom";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";

import * as S from "./Login.scss";

function Login() {
    window.history.pushState({}, null, "/login");

    return (
        <div className={S.loginContainer}>
            <Input type="text" label="Логин" />
            <Input type="password" label="Пароль" />
            <Button text="Войти" disabled={false} />

            <div className={S.registration}>Или <Link to="/registration">зарегистрироваться</Link></div>
        </div>
    )
}

export default Login;
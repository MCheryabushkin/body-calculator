import React from "react";
import { Link } from "react-router-dom";
import bodyApi from "../../api/bodyApi";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";

import * as S from "./Login.scss";

interface LoginState {
    isBtnDisabled: boolean;
}

class Login extends React.Component<{}, LoginState> {
    loginInputRef: any;
    passwordInputRef: any;

    constructor(props: any) {
        super(props);

        this.state = {
            isBtnDisabled: true,
        }

        this.loginInputRef = React.createRef();
        this.passwordInputRef = React.createRef();
    }

    componentDidMount(): void {
        window.history.pushState({}, null, "/login");
    }

    onInputChange = (value: any) => {
        if (this.loginInputRef.current.state.value && this.passwordInputRef.current.state.value && value)
            this.setState({ isBtnDisabled: false })
        else this.setState({ isBtnDisabled: true })
    }

    onLoginBtnClick = async (e: any) => {
        e.preventDefault();
        const { login, password } = e.target;
        const user = await bodyApi.loginUser(
            login.value.toLowerCase(), 
            password.value);
        if (typeof user !== 'string')
            bodyApi.setAuthorize(user.id, true)
                .then(() => localStorage.setItem("userId", user.id))
                .then(() => window.history.pushState({}, null, "/"))
                .then(() => window.location.reload());
    }

    render() {
        const { isBtnDisabled } = this.state;

        return (
            <form className={S.loginContainer} onSubmit={this.onLoginBtnClick}>
                <Input ref={this.loginInputRef} name="login" type="text" label="Логин" onChange={this.onInputChange} />
                <Input ref={this.passwordInputRef} name="password" type="password" label="Пароль" onChange={this.onInputChange} />
                <Button type="submit" text="Войти" disabled={false} />
    
                <div className={S.registration}>Или <Link to="/registration">зарегистрироваться</Link></div>
            </form>
        )
    }
}

export default Login;
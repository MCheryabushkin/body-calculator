import React from "react";
import bodyApi from "../../api/bodyApi";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import {getFatPercentage} from "../../utils/util.helper";

import * as S from "./Registration.scss"

interface RegState {
    isHip: boolean;
    isPasswordConfirm: boolean;
    user: any;
}

interface User {
    gender: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    repeatPassword: string;
    height: number | string;
    neck: number | string;
    waist: number | string;
    hip: number | string;
}

class Registration extends React.Component<{}, RegState> {
    formRef: any;

    constructor(props: any) {
        super(props);

        this.state = {
            isHip: false,
            isPasswordConfirm: true,
            user: {
                gender: '',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                repeatPassword: '',
                height: '',
                neck: '',
                waist: '',
                hip: '',
            } as User,
        }

        this.formRef = React.createRef();
    }

    onRegistrationClick = (e: any) => {
        e.preventDefault();
        const {user} = this.state;
        const newUser = this.createNewUser(user);
        bodyApi.addNewUser(newUser)
            .then(() => window.history.pushState({}, null, "/body-calculator/"))
            .then(() => window.location.reload());
    }

    createNewUser = (user: any) => {
        const fat = getFatPercentage(user);
        const bodyParameters = {
            fat: [fat],
            labels: ["анкета"],
            weight: [user.weight],
        };

        return { ...user, bodyParameters };
    }

    inputChange = (value: string, name: string) => {
        const {user: stateUser} = this.state;
        const user = Object.assign({}, stateUser);
        user[name] = value;

        if (name === 'repeatPassword') {
            const isPasswordConfirm = user[name] === user['password'];
            this.setState({ isPasswordConfirm });
        }

        if (name === 'gender') {
            const isHip = value === 'female' ? true : false;
            if (!isHip) delete user['hip'];
            this.setState({ isHip, user });
            return;
        }

        this.setState({ user });
    }

    isRegBtnDisable = (): boolean => {
        const { user, isPasswordConfirm } = this.state;
        let isDisabled = false;

        if (!isPasswordConfirm) return true;
        
        for (let key in user) {
            if (key === 'lastName') continue;
            if (key === 'gender') {
                if (user['gender'] === 'female' && !user['hip'])
                    isDisabled = true;
            } else if (!user[key]) isDisabled = true;
        }
        return isDisabled;
    }

    render() {
        const { isHip, isPasswordConfirm } = this.state;

        return (
            <div>
                <h2>Регистрация пользователя</h2>
                <form action="" ref={this.formRef}>
                    <Input type="text" label="Имя" name="firstName" onChange={this.inputChange} required />
                    <Input type="text" label="Фамилия" name="lastName" onChange={this.inputChange} />
                    <Input type="email" label="E-Mail" name="email" onChange={this.inputChange} required />
                    <Input type="password" label="Пароль" name="password" onChange={this.inputChange} required />
                    <div>
                        <Input type="password" label="Повторите пароль" name="repeatPassword" onChange={this.inputChange} 
                            required isError={!isPasswordConfirm} errorText="Пароли не совпадают" />
                    </div>
                    <div>
                        <Input type="radio" label="муж." name="gender" value="male" onChange={this.inputChange} />
                        <Input type="radio" label="жен." name="gender" value="female" onChange={this.inputChange} />
                    </div>
                    <Input type="number" label="Вес" name="weight" step="0.1" onChange={this.inputChange} required />
                    <Input type="number" label="Рост" name="height" step="0.1" onChange={this.inputChange} required />
                    <Input type="number" label="Обхват шеи" name="neck" step="0.1" onChange={this.inputChange} required />
                    <Input type="number" label="Обхват талии" name="waist" step="0.1" onChange={this.inputChange} required />
                    {isHip && <Input type="number" label="Обхват бедер" name="hip" step="0.1" onChange={this.inputChange} required />}
                </form>
                <Button type="submit" text="Зарегистрироваться" disabled={this.isRegBtnDisable()} onClick={this.onRegistrationClick} />
            </div>
        )
    }
}

export default Registration;
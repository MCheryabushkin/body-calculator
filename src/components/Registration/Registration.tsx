import React from "react";
import bodyApi from "../../api/bodyApi";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import {getFatPercentage} from "../../utils/util.helper";


interface RegState {
    isHip: boolean;
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
            .then(() => window.history.pushState({}, null, "/"))
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

        if (name === 'gender') {
            const isHip = value === 'female' ? true : false;
            if (!isHip) delete user['hip'];
            this.setState({ isHip, user });
            return;
        }

        this.setState({ user });
    }

    isRegBtnDisable = (): boolean => {
        const { user } = this.state;
        let isDisabled = false;
        for (let key in user) {
            if (key === 'gender') {
                if (user['gender'] === 'female' && !user['hip'])
                    isDisabled = true;
            } else if (!user[key]) isDisabled = true;
        }
        return isDisabled;
    }

    render() {
        const { isHip } = this.state;

        return (
            <div>
                <h2>Регистрация пользователя</h2>
                <form action="" ref={this.formRef}>
                    <Input type="text" label="Имя" name="firstName" onChange={this.inputChange} />
                    <Input type="text" label="Фамилия" name="lastName" onChange={this.inputChange} />
                    <Input type="email" label="E-Mail" name="email" onChange={this.inputChange} />
                    <Input type="password" label="Пароль" name="password" onChange={this.inputChange} />
                    <Input type="password" label="Повторите пароль" name="repeatPassword" onChange={this.inputChange} />
                    <div>
                        <Input type="radio" label="муж." name="gender" value="male" onChange={this.inputChange} />
                        <Input type="radio" label="жен." name="gender" value="female" onChange={this.inputChange} />
                    </div>
                    <Input type="number" label="Вес" name="weight" step="0.1" onChange={this.inputChange} />
                    <Input type="number" label="Рост" name="height" step="0.1" onChange={this.inputChange} />
                    <Input type="number" label="Обхват шеи" name="neck" step="0.1" onChange={this.inputChange} />
                    <Input type="number" label="Обхват талии" name="waist" step="0.1" onChange={this.inputChange} />
                    {isHip && <Input type="text" label="Обхват бедер" name="hip" step="0.1" onChange={this.inputChange} />}
                </form>
                <Button type="submit" text="Зарегистрироваться" disabled={this.isRegBtnDisable()} onClick={this.onRegistrationClick} />
            </div>
        )
    }
}

export default Registration;
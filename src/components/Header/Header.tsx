import React from "react";
import bodyApi from "../../api/bodyApi";
import Link from "../Link/Link";
import * as S from "./Header.scss";


export default class Header extends React.Component<{}, {}> {

    checkActive = (url: string) => {
        return location.pathname === url;
    }

    logOut = () => {
        bodyApi.setAuthorize(0, false)
            .then(() => localStorage.removeItem("userId"))
            .then(() => window.history.pushState({}, null, "/login"))
            .then(() => window.location.reload());
    }

    render () {
        const {pathname} = location;

        return (
            <div className={S.header}>
                <div className={S.logo}>
                    <h2>YoniFat</h2>
                </div>
                <div className={S.nav} key={pathname}>
                    <Link to="/" type="home">Главная</Link>
                    <Link to="/calculator" type="home">Калькулятор</Link>
                    <Link to="/progress" type="home">Мой прогресс</Link>
                </div>
                <div className={S.logOut}><span onClick={this.logOut}>Выйти</span></div>
            </div>
        )
    }
}
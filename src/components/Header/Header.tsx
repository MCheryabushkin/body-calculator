import React from "react";
// import Calculator from "../Calculator/Calculator";
import Link from "../Link/Link";
import * as S from "./Header.scss";


export default class Header extends React.Component<{}, {}> {

    checkActive = (url: string) => {
        return location.pathname === url;
    }
    render () {
        const {pathname} = location;

        return (
            <div className={S.header}>
                <div className={S.logo}>
                    <h2>YoniFat</h2>
                </div>
                <div className={S.nav} key={location.href}>
                    <Link to="/">Главная</Link>
                    <Link to="/calculator">Калькулятор</Link>
                    <Link to="/progress">Мой прогресс</Link>
                </div>
            </div>
        )
    }
}
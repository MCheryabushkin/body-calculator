import React from "react";
import { NavLink } from "react-router-dom";
import bodyApi from "../../api/bodyApi";
import Link from "../Link/Link";
import * as S from "./Header.scss";

interface IProps {
    setKey: (key: string) => void;
}
interface IState {
    isSidebar: boolean;
}

export default class Header extends React.Component<{}, IState> {
    user: any;

    constructor(props: any) {
        super(props);

        this.state = {
            isSidebar: false,
        }
    }

    checkActive = (url: string) => {
        return location.pathname === url;
    }

    logOut = () => {
        bodyApi.setAuthorize(0, false)
            .then(() => localStorage.removeItem("userId"))
            .then(() => window.history.pushState({}, null, "/login"))
            .then(() => window.location.reload());
    }

    onClickBurger = () => {
        this.setState({ isSidebar: true });
    }

    onCloseSidebar = (e: any) => {
        const isSidebar = /(_sidebar_)/.test(e.target.className);
        if (isSidebar)
            this.setState({ isSidebar: false });
    };

    onLinkClick = (e: any) => {
        this.setState({ isSidebar: false });
    }

    renderLogo = () => {
        const pathname = window.location.pathname;
        return pathname === '/' 
            ? 'YoniFat'
            : <NavLink to="/" onClick={this.onLinkClick}>YoniFat</NavLink>
    }

    render () {
        const {pathname} = location;
        const { isSidebar } = this.state;

        return (
            <>
                <div className={S.header}>
                    <div className={S.logo}>
                        <h2>{this.renderLogo()}</h2>
                    </div>
                    <div className={S.nav} key={pathname}>
                        <Link to="/" type="home" onClick={this.onLinkClick}>Главная</Link>
                        <Link to="/calculator" type="home" onClick={this.onLinkClick}>Калькулятор</Link>
                        <Link to="/progress" type="home" onClick={this.onLinkClick}>Мой прогресс</Link>
                        <Link to="/help" type="home" onClick={this.onLinkClick}>Помощь</Link>
                    </div>
                    <div className={S.logOut}><span onClick={this.logOut}>Выйти</span></div>
                    <div className={S.burger} onClick={this.onClickBurger}></div>
                </div>
                {isSidebar && <div className={S.sidebar} onClick={this.onCloseSidebar}>
                    <div className={S.sidebarBody}>
                        <ul className={S.sidebarNav}>
                            <li className={S.listItem}><NavLink className={S.link} to="/" onClick={this.onLinkClick}>Главная</NavLink></li>
                            <li className={S.listItem}><NavLink className={S.link} to="/progress" onClick={this.onLinkClick}>Мой прогресс</NavLink></li>
                            <li className={S.listItem}><NavLink className={S.link} to="/help" onClick={this.onLinkClick}>Помощь</NavLink></li>
                            <li className={S.listItem}><div><span onClick={this.logOut}>Выйти</span></div></li>
                        </ul>
                    </div>
                </div>}
            </>
        )
    }
}
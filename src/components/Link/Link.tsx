import React from "react";
import { NavLink } from 'react-router-dom';
import cn from 'classnames';

import * as S from "./Link.scss";


interface IProp {
    to: string;
    element?: any;
}

class Link extends React.Component<IProp> {

    constructor(props: IProp) {
        super(props);
    }

    render() {
        return (
            <NavLink 
                className={({isActive}) => cn(S.link, isActive && S.activeLink)} 
                {...this.props}
            >{this.props.children}</NavLink>
        )
    }
}

export default Link;
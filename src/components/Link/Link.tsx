import React from "react";
import { NavLink } from 'react-router-dom';
import cn from 'classnames';
import CUSTOM_ICONS from "../../Icons/index";

import * as S from "./Link.scss";

interface IProp {
    to: string;
    element?: any;
    type: string;
}

class Link extends React.Component<IProp> {

    constructor(props: IProp) {
        super(props);
    }

    render() {
        const {type} = this.props;
        // @ts-ignore
        const CustomIcon = CUSTOM_ICONS[type];

        return (
            <NavLink 
                className={({isActive}) => cn(S.link, isActive && S.activeLink)} 
                {...this.props}
            >{this.props.children}</NavLink>
        )
    }
}

export default Link;
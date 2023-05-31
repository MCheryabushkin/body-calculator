import React from "react";
import { NavLink } from 'react-router-dom';
import cn from 'classnames';
import CUSTOM_ICONS from "../../Icon/Icons/index";

import * as S from "./Link.scss";

interface IProp {
    to: string;
    element?: any;
    type: string;
    onClick: (key: string) => void;
}

class Link extends React.Component<IProp> {

    constructor(props: IProp) {
        super(props);
    }

    onClick = (e: any) => {
        if (this.props.onClick)
            this.props.onClick(e);
    }

    render() {
        const {type} = this.props;
        // @ts-ignore
        const CustomIcon = CUSTOM_ICONS[type];

        return (
            <NavLink 
                className={({isActive}) => cn(S.link, isActive && S.activeLink)} 
                {...this.props} onClick={this.onClick}
            >{this.props.children}</NavLink>
        )
    }
}

export default Link;
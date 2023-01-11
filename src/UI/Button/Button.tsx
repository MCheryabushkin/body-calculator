import cn from "classnames";
import React from "react";

import * as S from "./Button.scss";

interface InputProps {
    text: string;
    disabled: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: (value: any) => void;
}

export default class Button extends React.Component<InputProps, {}> {

    render() {
        const {
            text,
            disabled,
            onClick,
        } = this.props;
        return (
            <> 
                <button className={cn(S.btn, disabled && S.disabled)} {...this.props}>{text}</button>
            </>
        )
    }
}
import React from "react";

import * as S from "./Button.scss";

interface InputProps {
    text: string;
    disabled: boolean;
    onClick?(value: any): () => void;
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
                <button className={S.btn} disabled={disabled} onClick={onClick}>{text}</button>
            </>
        )
    }
}
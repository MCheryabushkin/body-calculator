import React from "react";
import cn from "classnames";

import * as S from "./Card.scss";

interface CardProps {
    cardType: string;
    title: string;
    value?: any;
    btnTitle: string;
    icon: any;
    classNames?: any;
    onClickCardBtn: (cardType: string) => void;
    disabled?: any;
}

interface CardState {
    isHovered: boolean;
}

export default class Card extends React.Component<CardProps, CardState> {

    constructor(props: any) {
        super(props);

        this.state = {
            isHovered: false,
        }
    }

    onClickCardBtn = () => {
        const {onClickCardBtn, cardType, disabled} = this.props;
        if (disabled) return;

        onClickCardBtn(cardType);
    }

    onCardHover = () => { this.setState({ isHovered: true }) }
    onCardLeave = () => { this.setState({ isHovered: false }) }

    render () {
        const {isHovered} = this.state;
        const { value, title, btnTitle, icon, disabled } = this.props;

        return (
            <div className={S.paramsContainer}>
                <div className={cn(S.card, disabled && S.disabledCard)}
                    onMouseOver={this.onCardHover}
                    onMouseLeave={this.onCardLeave}>
                    <div className={S.textContainer}>
                        <div className={cn(S.icon, S[`${icon}Icon`], isHovered && !disabled && S.iconHovered)}><i></i></div>
                        <div className={S.title}>{title}</div>
                        {value && <div className={S.weight}>{value}</div>}
                    </div>
                    <div className={cn(S.btn, disabled && S.disabledBtn)} onClick={this.onClickCardBtn}>{btnTitle}</div>
                </div>
            </div>
        )
    }
}
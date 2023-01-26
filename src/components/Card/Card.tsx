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
        const {onClickCardBtn, cardType} = this.props;

        onClickCardBtn(cardType);
    }

    onCardHover = () => { this.setState({ isHovered: true }) }
    onCardLeave = () => { this.setState({ isHovered: false }) }

    render () {
        const {isHovered} = this.state;
        const { value, title, btnTitle, icon } = this.props;

        return (
            <div className={S.paramsContainer}>
                <div className={S.card}
                    onMouseOver={this.onCardHover}
                    onMouseLeave={this.onCardLeave}>
                    <div className={S.textContainer}>
                        <div className={cn(S.icon, S[`${icon}Icon`], isHovered && S.iconHovered)}><i></i></div>
                        <div className={S.title}>{title}</div>
                        {value && <div className={S.weight}>{value}</div>}
                    </div>
                    <div className={S.btn} onClick={this.onClickCardBtn}>{btnTitle}</div>
                </div>
            </div>
        )
    }
}
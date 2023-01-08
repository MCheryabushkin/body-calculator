import React from "react";
import cn from 'classnames';
import moment from 'moment';

import * as S from "./Home.scss";
import Modal from "../Modal/Modal";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import bodyApi from "../../api/bodyApi";

interface IState {
    isHovered: boolean;
    isWeightModal: boolean;
    currentWeight: number | string;
    currentUser: any;
}


export default class Home extends React.Component<{}, IState> {
    weightInputRef: any;

    constructor(props: any) {
        super(props);

        this.state = {
            isHovered: false,
            isWeightModal: false,
            currentWeight: 0,
            currentUser: {},
        }

        this.weightInputRef = React.createRef();
    }

    async componentDidMount() {
        if (window.location.pathname !== '/')
            window.history.pushState({}, null, "/");
        await this.getCurrentWeight();
        await this.setCurrentUser();
    }

    setCurrentUser = async () => {
        const currentUser = await bodyApi.getUserWeightHistory(0);
        this.setState({ currentUser });
    }

    onCardHover = () => { this.setState({ isHovered: true }) }
    onCardLeave = () => { this.setState({ isHovered: false }) }

    getDate = () => {
        const date = new Date();
        const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        // @ts-ignore
        const dayOfWeek: any = days[moment(date).format('e')];
        const month = months[date.getMonth()];
        const dayOfMonth = date.getDate();
        return <span>{dayOfWeek}, <br />{dayOfMonth} {month}</span>;
    }

    renderModalContent = () => {
        const { currentWeight } = this.state;
        return (
            <form action="submit" className={S.form}>
                <Input type="number" ref={this.weightInputRef} value={currentWeight} label="Утренний вес" />
                <Button text="Отправить" disabled={false} onClick={this.onClickWeightBtn} />
            </form>
        )
    }

    onWeightChange = (value: any): any => {
        if (!parseFloat(value)) return;
        this.setState({ currentWeight: parseFloat(value) });
    }
    onClickWeightBtn = (value: any): any => {
        value.preventDefault();

        const user: any = {};
        const currentWeight = parseFloat(this.weightInputRef.current.state.value);
        const date = new Date();
        const { currentUser } = this.state;

        currentUser[moment(date).format("DD-MM-YYYY").split("T")[0]] = {weight: currentWeight};
        this.setState({ isWeightModal: false, currentUser });
        bodyApi.updateUserWeightHistory(currentUser);
        this.getCurrentWeight();
    }

    changeWeight = () => {
        this.setState({ isWeightModal: true })
    }

    onModalClose = () => {
        this.setState({ isWeightModal: false })
    }

    getCurrentWeight = async () => {
        const date = new Date();
        const today = moment(date).format("DD-MM-YYYY").split("T")[0];
        const currentWeight = await bodyApi.getUserWeight(today, 0);
        this.setState({ currentWeight });
    }

    render() {
        const {isHovered, isWeightModal, currentWeight } = this.state;

        return (
            <div className={S.homeContainer}>
                <div className={S.dateContainer}>
                    <div className={S.date}>
                        <div>{this.getDate()}</div>
                    </div>
                </div>
                <div className={S.paramsContainer}>
                    <div className={S.card}
                        onMouseOver={this.onCardHover}
                        onMouseLeave={this.onCardLeave}>
                        <div className={S.textContainer}>
                            <div className={cn(S.icon, isHovered && S.iconHovered)}><i></i></div>
                            <div className={S.title}>Утренний вес</div>
                            <div className={S.weight}><span>{currentWeight}</span> кг</div>
                        </div>
                        <div className={S.btn} onClick={this.changeWeight}>Изменить</div>
                    </div>
                </div>

                {isWeightModal && <Modal content={this.renderModalContent()} onClose={this.onModalClose} />}
            </div>
        )
    }
}
import React from "react";
import cn from 'classnames';
import moment from 'moment';

import * as S from "./Home.scss";
import Modal from "../Modal/Modal";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import bodyApi from "../../api/bodyApi";
import { getDate, getFatPercentage, getTodayDate, getUserId } from "../../utils/util.helper";
import Journal from "../Journal/Journal";
import Card from "../Card/Card";

interface IState {
    isWeightModal: boolean;
    currentWeight: number | string;
    currentUserWeightHistory: any;
    modalType: string | null;
    currentUser: any;
    weightError: boolean;
    weightHistory: any;
}


export default class Home extends React.Component<{}, IState> {
    weightInputRef: any;
    userId: number = getUserId();
    today: string = getTodayDate();

    constructor(props: any) {
        super(props);

        this.state = {
            isWeightModal: false,
            currentWeight: 0,
            currentUserWeightHistory: {},
            modalType: null,
            currentUser: {},
            weightError: false,
            weightHistory: null,
        }

        this.weightInputRef = React.createRef();
    }

    async componentDidMount() {
        if (window.location.pathname !== '/')
            window.history.pushState({}, null, "/");
        await this.init();
    }
    init = async () => {
        await this.getCurrentWeight();
        await this.setCurrentUserWeight();
        await this.getCurrentUser();
        await this.getWeightHistory();
    }

    setCurrentUserWeight = async () => {
        const currentUserWeightHistory = await bodyApi.getUserWeightHistory(this.userId);
        this.setState({ currentUserWeightHistory });
    }

    getCurrentUser = async () => {
        const currentUser = await bodyApi.getUserById(this.userId);
        this.setState({ currentUser });
    }

    getWeightHistory = async () => {
        const weightHistory = await bodyApi.getWeightHistory(this.userId);
        this.setState({ weightHistory });
    }

    getDate = () => {
        const { dayOfWeek, dayOfMonth, month } = getDate(true);
        return <span>{dayOfWeek}, <br />{dayOfMonth} {month}</span>;
    }

    renderModalContent = () => {
        const { modalType } = this.state;
        
        switch(modalType) {
            case "weight":
                return this.renderWeightForm();
            case "report":
                return this.renderReportForm();
        }
    }

    renderWeightForm = () => {
        const { currentWeight } = this.state;
        return (
            <form action="submit" className={S.form}>
                <Input type="number" ref={this.weightInputRef} value={currentWeight} label="Утренний вес" />
                <Button text="Отправить" disabled={false} onClick={this.onClickWeightBtn} />
            </form>
        )
    }

    renderReportForm = () => {
        const { currentUser: { gender } } = this.state;
        return (
            <form action="submit" className={S.form} onSubmit={this.sendWeeklyReport}>
                <Input type="number" name="neck" label="Обхват шеи" />
                <Input type="number" name="waist" label="Обхват талии" />
                {gender === "female" && <Input type="number" name="hip" label="Обхват бёдер" />}
                <Button type="submit" text="Отправить" disabled={false} />
            </form>
        )
    }

    renderModalWeightError = () => {
        return <div>Заполните сегодняшний вес</div>
    }

    sendWeeklyReport = (e: any) => {
        e.preventDefault();
        const { currentUser: { gender, height}, currentWeight } = this.state;
        const { neck, waist, hip } = e.target;
        const fat = getFatPercentage({neck: neck.value, waist: waist.value, hip: hip?.value, gender, height});
        const label = `отчет ${this.today}`;
        // const weight = currentWeight;
        const weight = this.calculateMiddleWeight();
        debugger;
        bodyApi.sendWeeklyReport({fat, label, weight, userId: this.userId})
            .then(() => this.setState({ isWeightModal: false }))
    }

    calculateMiddleWeight = (): number => {
        const {weightHistory} = this.state;
        // const lastWeigh = weightHistory[this.today];
        const [day, month, year] = this.today.split("-");
        let summ = 0;
        let count = 0;
        for (let i = parseInt(day); i >= (parseInt(day) - 6); i--) {
            const date = weightHistory[`${i}-${month}-${year}`];
            if (date) {
                summ += date.weight;
                count++;
            }
        }
        return (summ / count);
    }

    onWeightChange = (value: any): any => {
        if (!parseFloat(value)) return;
        this.setState({ currentWeight: parseFloat(value) });
    }
    onClickWeightBtn = (value: any): any => {
        value.preventDefault();

        const currentWeight = parseFloat(this.weightInputRef.current.state.value);
        const { currentUserWeightHistory } = this.state;

        currentUserWeightHistory[this.today] = {weight: currentWeight};
        this.setState({ isWeightModal: false, currentUserWeightHistory });
        bodyApi.updateUserWeightHistory(currentUserWeightHistory, this.userId);
        this.getCurrentWeight();
    }

    onCardClick = (modalType: any) => {
        if (modalType === 'report' && !this.state.currentWeight) {
            this.renderWeightError();
            return;
        }
        this.setState({ 
            isWeightModal: true,
            modalType,
        })
    }

    canSetReport = async () => {
        const {labels} = await bodyApi.getBodyParametersByUserId(this.userId);
    }

    renderWeightError = () => {
        this.setState({ weightError: true })
    }

    onModalClose = () => {
        this.setState({ 
            isWeightModal: false,
            weightError: false,
        })
    }

    getCurrentWeight = async () => {
        const currentWeight = await bodyApi.getUserWeight(this.today, this.userId);
        this.setState({ currentWeight });
    }

    renderCurrentWeight = (currentWeight: any) => {
        return <><span>{currentWeight}</span> кг</> 
    }

    render() {
        const { isWeightModal, currentWeight, weightError } = this.state;

        return (
            <div key={currentWeight}>
                <div className={S.homeContainer}>
                    <div className={S.dateContainer}>
                        <div className={S.date}>
                            <div>{this.getDate()}</div>
                        </div>
                    </div>
                    <Card
                        cardType="weight"
                        title="Утренний вес"
                        value={this.renderCurrentWeight(currentWeight)}
                        btnTitle="Изменить"
                        icon="weight"
                        onClickCardBtn={this.onCardClick}
                    />
                    <Card
                        cardType="report"
                        title="Еженедельный отчёт"
                        btnTitle="Сдать"
                        icon="ruler"
                        onClickCardBtn={this.onCardClick}
                    />

                    {isWeightModal && <Modal content={this.renderModalContent()} onClose={this.onModalClose} />}
                    {weightError && <Modal content={this.renderModalWeightError()} onClose={this.onModalClose} />}
                </div>

                <Journal />
            </div>
        )
    }
}
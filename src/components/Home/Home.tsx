import React from "react";

import * as S from "./Home.scss";
import Modal from "../Modal/Modal";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import bodyApi from "../../api/bodyApi";
import { getDate, getFatPercentage, getMonthsDayCount, getTodayDate, getUserId } from "../../utils/util.helper";
import Journal from "../Journal/Journal";
import Card from "../Card/Card";

interface IState {
    isWeightModal: boolean;
    currentWeight: number | string;
    currentSteps: number | string;
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
            currentSteps: 0,
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
            case "steps":
                return this.renderStepsForm();
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

    renderStepsForm = () => {
        return (
            <form action="submit" onSubmit={this.onClickStepsBtn} className={S.form}>
                <Input type="number" name="steps" label="Шаги за день" />
                <Button text="Отправить" disabled={false} />
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
        
        bodyApi.sendWeeklyReport({fat, label, weight, userId: this.userId})
            .then(() => this.setState({ isWeightModal: false }))
    }

    calculateMiddleWeight = (): number => {
        const {weightHistory} = this.state;
        const [day, month, year]: any[] = this.today.split("-");
        let summ = 0;
        let count = 0;
        for (let i = parseInt(day); i >= (parseInt(day) - 6); i--) {
            const numOfMonth = (i <= 0) ? (month - 1 == 0 ? 12 : month - 1) : month;
            const numOfYear = (numOfMonth <= 0) ? (year - 1) : year;
            const daysCount = getMonthsDayCount(numOfMonth, numOfYear);
            const dayOfMonth = (i <= 0) ? daysCount + i : i;

            console.log(`${this.formatDate(dayOfMonth, numOfMonth)}-${numOfYear}`);
            const date = weightHistory[`${this.formatDate(dayOfMonth, numOfMonth)}-${numOfYear}`];
            if (date) {
                summ += date.weight;
                count++;
            }
        }
        return (summ / count);
    }

    formatDate = (day: number | string, month: number | string) => {
        const dayNew = (`${day}`.length === 1) ? "0" + day : day;
        const monthNew = (`${month}`.length === 1) ? "0" + month : month;
        return `${dayNew}-${monthNew}`;
    }

    onWeightChange = (value: any): any => {
        if (!parseFloat(value)) return;
        this.setState({ currentWeight: parseFloat(value) });
    }
    onClickWeightBtn = (value: any): any => {
        value.preventDefault();

        const currentWeight = parseFloat(this.weightInputRef.current.state.value);
        const { currentUserWeightHistory } = this.state;

        if (!currentUserWeightHistory[this.today])
            currentUserWeightHistory[this.today] = {weight: 0};
        currentUserWeightHistory[this.today].weight = currentWeight;
        this.setState({ isWeightModal: false, currentUserWeightHistory });
        bodyApi.updateBodyParameters(currentUserWeightHistory, this.userId);
        this.getCurrentWeight();
    }

    onClickStepsBtn = (value: any): any => {
        value.preventDefault();
        const currentSteps = parseFloat(value.target.steps.value);
        const { currentUserWeightHistory } = this.state;

        if (!currentUserWeightHistory[this.today])
            currentUserWeightHistory[this.today] = { steps: 0 };
        currentUserWeightHistory[this.today].steps = currentSteps;
        this.setState({ isWeightModal: false, currentUserWeightHistory });
        bodyApi.updateBodyParameters(currentUserWeightHistory, this.userId);
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
        const { weight: currentWeight, steps: currentSteps} = await bodyApi.getUserParams(this.today, this.userId);
        this.setState({ currentWeight, currentSteps });
    }

    renderCurrentParam = (currentParam: any, union?: string) => {
        return <><span>{currentParam ? currentParam : '-'}</span> {union}</>
    }

    render() {
        const { isWeightModal, currentWeight, weightError, currentSteps } = this.state;

        return (
            <div key={`${currentWeight}-${currentSteps}`}>
                <div className={S.homeContainer}>
                    <div className={S.dateContainer}>
                        <div className={S.date}>
                            <div>{this.getDate()}</div>
                        </div>
                    </div>
                    <Card
                        cardType="weight"
                        title="Утренний вес"
                        value={this.renderCurrentParam(currentWeight, 'кг')}
                        btnTitle="Изменить"
                        icon="weight"
                        onClickCardBtn={this.onCardClick}
                    />
                    <Card
                        cardType="steps"
                        title="Шаги за день"
                        value={this.renderCurrentParam(currentSteps)}
                        btnTitle="Изменить"
                        icon="steps"
                        onClickCardBtn={this.onCardClick}
                    />
                    <Card
                        cardType="report"
                        title="Еженедельный отчёт"
                        btnTitle="Сдать"
                        icon="ruler"
                        onClickCardBtn={this.onCardClick}
                        // disabled
                    />
                </div>

                <Journal />

                {isWeightModal && <Modal content={this.renderModalContent()} onClose={this.onModalClose} />}
                {weightError && <Modal content={this.renderModalWeightError()} onClose={this.onModalClose} />}
            </div>
        )
    }
}
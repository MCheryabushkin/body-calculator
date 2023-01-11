import React from "react";

import * as S from "./Home.scss";
import Modal from "../Modal/Modal";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import bodyApi from "../../api/bodyApi";
import { formatDate, getDate, getFatPercentage, getMonthsDayCount, getTodayDate, getUserId, randomStringKey } from "../../utils/util.helper";
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
    journalKey: string;
    bodyParameters: any;
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
            journalKey: randomStringKey(10),
            bodyParameters: {},
        }

        this.weightInputRef = React.createRef();
    }

    async componentDidMount() {
        if (window.location.pathname !== '/body-calculator/')
            window.history.pushState({}, null, "/body-calculator");
        await this.init();
    }
    init = async () => {
        await this.getCurrentWeight();
        await this.setCurrentUserWeight();
        await this.getCurrentUser();
        await this.getWeightHistory();
        await this.getBodyParameters();
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

    getBodyParameters = async () => {
        const bodyParameters = await bodyApi.getBodyParametersByUserId(this.userId);
        this.setState({ bodyParameters });
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
            <form action="submit" className={S.form} onSubmit={this.onChangeWeightOrSteps}>
                <Input type="date" name="date" label="Дата" value={formatDate(this.today)} />
                <Input type="number" name="weight" step="0.01" value={currentWeight} label="Утренний вес" />
                <Button type="submit" text="Отправить" disabled={false} />
            </form>
        )
    }

    renderReportForm = () => {
        const { currentUser: { gender } } = this.state;
        return (
            <form action="submit" className={S.form} onSubmit={this.sendWeeklyReport}>
                <Input type="number" name="neck" step="0.01" label="Обхват шеи" />
                <Input type="number" name="waist" step="0.01" label="Обхват талии" />
                {gender === "female" && <Input type="number" name="hip" label="Обхват бёдер" />}
                <Button type="submit" text="Отправить" disabled={false} />
            </form>
        )
    }

    renderStepsForm = () => {
        return (
            <form action="submit" onSubmit={this.onChangeWeightOrSteps} className={S.form}>
                <Input type="date" name="date" label="Дата" value={formatDate(this.today)} />
                <Input type="number" name="steps" step="0.01" label="Шаги за день" />
                <Button text="Отправить" disabled={false} />
            </form>
        )
    }

    renderModalWeightError = () => <div>Заполните сегодняшний вес</div>

    sendWeeklyReport = (e: any) => {
        e.preventDefault();
        const { currentUser: { gender, height} } = this.state;
        const { neck, waist, hip } = e.target;
        const fat = getFatPercentage({neck: neck.value, waist: waist.value, hip: hip?.value, gender, height});
        const label = `отчет ${this.today}`;
        const { weight, minWeight } = this.calculateMiddleWeight();
        
        bodyApi.sendWeeklyReport({
            fat, label, weight, 
            userId: this.userId, minWeight, 
            neck: parseFloat(neck.value), 
            waist: parseFloat(waist.value), 
            hip: hip?.value ? parseFloat(hip.value) : 0
        })
            .then(() => this.setState({ isWeightModal: false }))
            .then(() => window.history.pushState({}, null, "/"))
            .then(() => window.location.reload());
    }

    calculateMiddleWeight = (): { weight: number, minWeight: number } => {
        const {weightHistory} = this.state;
        const [day, month, year]: any[] = this.today.split("-");
        let summ = 0;
        let count = 0;
        let minWeight;
        
        for (let i = parseInt(day); i >= (parseInt(day) - 6); i--) {
            const numOfMonth = (i <= 0) ? (month - 1 == 0 ? 12 : month - 1) : month;
            const numOfYear = (numOfMonth <= 0) ? (year - 1) : year;
            const daysCount = getMonthsDayCount(numOfMonth, numOfYear);
            const dayOfMonth = (i <= 0) ? daysCount + i : i;

            console.log(`${this.formatDate(dayOfMonth, numOfMonth)}-${numOfYear}`);
            const date = weightHistory[`${this.formatDate(dayOfMonth, numOfMonth)}-${numOfYear}`];
            if (date && date.weight) {
                minWeight = (minWeight && minWeight < date.weight) ? minWeight : date.weight;
                summ += date.weight;
                count++;
            }
        }
        return { weight: (summ / count), minWeight };
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

    onChangeWeightOrSteps = (e: any) => {
        e.preventDefault();
        const { steps, weight, date } = e.target;
        const value = steps?.value || weight?.value;
        const name = steps?.name || weight?.name;
        if (!value  || !date) return;

        const convertedDate = getTodayDate(date.value);
        const currentValue = parseFloat(value);
        const { currentUserWeightHistory } = this.state;

        if (!currentUserWeightHistory[convertedDate])
            currentUserWeightHistory[convertedDate] = { [name]: 0 };
        currentUserWeightHistory[convertedDate][name] = currentValue;
        this.setState({ isWeightModal: false, currentUserWeightHistory });
        bodyApi.updateBodyParameters(currentUserWeightHistory, this.userId);
        this.getCurrentWeight();
        this.getWeightHistory();
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

    canSetReport = () => {
        const { dayOfWeek } = getDate();
        const { bodyParameters: { labels } } = this.state;
        const label = `отчет ${this.today}`;
        if (labels && labels.find((el: string) => el === label))
            return false;

        return (dayOfWeek === 'суббота' || dayOfWeek === 'воскресенье' || dayOfWeek === 'понедельник') ? true : false;
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
        const journalKey = randomStringKey(10);
        this.setState({ currentWeight, currentSteps, journalKey });
    }

    renderCurrentParam = (currentParam: any, union?: string) => <span><span>{currentParam ? currentParam : '-'}</span> {union}</span>

    render() {
        const { isWeightModal, currentWeight, weightError, currentSteps, journalKey } = this.state;

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
                        disabled={!this.canSetReport()}
                    />
                </div>

                <Journal key={journalKey} />

                {isWeightModal && <Modal content={this.renderModalContent()} onClose={this.onModalClose} />}
                {weightError && <Modal content={this.renderModalWeightError()} onClose={this.onModalClose} />}
            </div>
        )
    }
}
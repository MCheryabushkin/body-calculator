import React from "react";
import bodyApi from "../../api/bodyApi";
import { getDate, getUserId } from "../../utils/util.helper";
import moment from 'moment';

import * as S from "./Journal.scss";

interface JournalState {
    weightHistory: any;
    isLoading: boolean;
}

export default class Journal extends React.Component<{}, JournalState> {

    constructor(props: any) {
        super(props);
        
        this.state = {
            weightHistory: [],
            isLoading: false,
        }
    }

    componentDidMount(): void {
        this.getWeightHistory();
    }

    getWeightHistory = async () => {
        const userId = getUserId();
        const weightHistory = await bodyApi.getUserWeightHistory(userId);
        this.setState({ weightHistory, isLoading: true });
    }

    sortJournal = (a: string, b: string): number => {
        const [aDay, aMonth, aYear] = a.split('-');
        const [bDay, bMonth, bYear] = b.split('-');

        return new Date(`${aMonth}-${aDay}-${aYear}`) < new Date(`${bMonth}-${bDay}-${bYear}`) ? -1 : 1;
    }

    renderJournal = () => {
        const {weightHistory} = this.state;

        return Object.keys(weightHistory)
            .sort((a, b) => this.sortJournal(a, b))
            .reverse()
            .map(date => {
                const { dayOfMonth, month } = getDate(false, moment(date, "DD-MM-YYYY").format());
                const {weight, steps} = weightHistory[date];
                
                return(
                    <div key={date} className={S.item}>
                        <div className={S.date}>{dayOfMonth} {month}</div>
                        <div className={S.weight}>{weight ? weight : "-"}<span>кг</span></div>
                        <div className={S.weight}>{steps ? steps : "-"}<span>шагов</span></div>
                    </div>
                )
            });
    }

    render() {
        const {isLoading} = this.state;
        if (!isLoading)
            return <></>
        
        return (
            <div className={S.journalContainer}>
                {this.renderJournal()}
            </div>
        )
    }
}
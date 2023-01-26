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

    renderJournal = () => {
        const {weightHistory} = this.state;

        return Object.keys(weightHistory).reverse().map(date => {
            const { dayOfMonth, month } = getDate(false, moment(date, "DD-MM-YYYY").format());
            const {weight} = weightHistory[date];
            
            return(
                <div key={date} className={S.item}>
                    <div className={S.date}>{dayOfMonth} {month}</div>
                    <div className={S.weight}>{weight}<span>кг</span></div>
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
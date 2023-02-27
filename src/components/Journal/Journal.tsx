import React from "react";
import bodyApi from "../../api/bodyApi";
import { getDate, getUserId } from "../../utils/util.helper";
import moment from 'moment';
import cn from 'classnames';

import * as S from "./Journal.scss";


const JOURNAL_PAGINATION_COUNTS = 7;

interface JournalState {
    weightHistory: any;
    isLoading: boolean;
    currentPage: number;
}

export default class Journal extends React.Component<{}, JournalState> {

    constructor(props: any) {
        super(props);
        
        this.state = {
            weightHistory: [],
            isLoading: false,
            currentPage: 1,
        }
    }

    componentDidMount(): void {
        this.getWeightHistory();
    }

    componentWillUnmount(): void {
        this.setState({ isLoading: false });
    }

    getWeightHistory = async () => {
        const userId = getUserId();
        await bodyApi.getUserWeightHistory(userId)
            .then((weightHistory) => this.setState({ weightHistory, isLoading: true }));
    }

    sortJournal = (a: string, b: string): number => {
        const [aDay, aMonth, aYear] = a.split('-');
        const [bDay, bMonth, bYear] = b.split('-');

        return new Date(`${aMonth}-${aDay}-${aYear}`) < new Date(`${bMonth}-${bDay}-${bYear}`) ? -1 : 1;
    }

    renderPagination = () => {
        const {weightHistory, currentPage} = this.state;
        const sectionCount = Math.ceil(Object.keys(weightHistory).length / JOURNAL_PAGINATION_COUNTS);
        const isPrevBtnDisable = currentPage === 1;
        const isNextBtnDisable = currentPage === sectionCount;

        if (sectionCount > 1) {
            return (
                <div className={S.pagination}>
                    {!isPrevBtnDisable && <div className={S.pagArrowPrev} onClick={() => this.onPagArrowClick(-1)}></div>}
                    {this.renderPaginationBtn(sectionCount)}
                    {!isNextBtnDisable && <div className={S.pagArrowNext} onClick={() => this.onPagArrowClick(1)}></div>}
                </div>
            )
        }
    }

    onPagArrowClick = (val: number) => {
        const { currentPage } = this.state;
        const newPage = currentPage + val;
        this.setState({ currentPage: newPage });
    }

    renderPaginationBtn = (count: number) => {
        const {currentPage} = this.state;
        const pagination: any = [];
        
        for (let i = 1; i <= count; i++)
            pagination.push(
                <div 
                    key={`section-${i}`} 
                    className={cn(
                        S.paginationBtn,
                        i === currentPage && S.active
                    )} 
                    data-id={i} 
                    onClick={this.setPagNumber}>{i}</div>
            );
        return pagination;
    }

    setPagNumber = (e: any) => {
        const currentPage = parseInt(e.target.getAttribute("data-id"));
        this.setState({ currentPage });
    }

    renderJournal = () => {
        const {weightHistory, currentPage} = this.state;
        const startIndex = (currentPage-1) * JOURNAL_PAGINATION_COUNTS;
        const endIndex = startIndex + JOURNAL_PAGINATION_COUNTS;
        
        return Object.keys(weightHistory)
            .sort((a, b) => this.sortJournal(a, b))
            .reverse()
            .slice(startIndex, endIndex)
            .map(date => {
                const { dayOfMonth, month } = getDate(false, moment(date, "DD-MM-YYYY").format());
                const {weight, steps} = weightHistory[date];
                const isFullReport = steps && weight;
                    
                return(
                    <div key={date} className={cn(S.item, isFullReport && S.fullReport)}>
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
            return null;
        
        return (
            <div className={S.journalContainer}>
                {this.renderJournal()}
                {this.renderPagination()}
            </div>
        )
    }
}
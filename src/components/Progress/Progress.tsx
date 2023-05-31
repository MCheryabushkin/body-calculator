import React from "react";
import { install } from 'resize-observer';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import bodyApi from "../../api/bodyApi";
import { User } from "../../interfaces";

import * as S from "./Progress.scss";
import { getUserId } from "../../utils/util.helper";
import Icon from "../../Icon/Icon";
interface IState {
    user: User;
    isLoading: boolean;
}

export default class Progress extends React.Component<{}, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            user: {} as User,
            isLoading: false,
        }
    }

    componentDidMount(): void {
        this.getData();
        if (!window.ResizeObserver) install();
    }

    getData = async () => {
        const userId = getUserId();
        const user: User = await bodyApi.getUserById(userId);
        this.setState({ user, isLoading: true });
    }

    renderWeeklyBar = () => {
        const { user } = this.state;
        const { bodyParameters: { reportData }, gender } = user;

        if (!reportData) return [];
        return reportData.reverse().map(({ minWeight, reportNumber, date, neck, waist, hip, fat, weight }) => (
            <div key={date} className={S.reportLine}>
                <div className={S.darkBlock}>
                    <span className={S.reportNumber}>Отчёт {reportNumber}</span>
                    <span className={S.reportDate}>{date.split("-").join(".")}</span>
                </div>
                <div className={S.lightBlock}>
                    <div className={S.paramItem}>
                        <span className={S.paramTitle}>% жира</span>
                        <span>{fat}</span>
                        {/* <Icon type="arrow-up" className={S.icon}></Icon> */}
                    </div>
                    <div className={S.paramItem}>
                        <span className={S.paramTitle}>средний вес</span>
                        <span className={S.paramValue}>{weight.toFixed(2)}<span>кг</span></span>
                    </div>
                    <div className={S.paramItem}>
                        <span className={S.paramTitle}>мин. вес</span>
                        <span className={S.paramValue}>{minWeight.toFixed(2)}<span>кг</span></span>
                    </div>
                    <div className={S.paramItem}>
                        <span className={S.paramTitle}>обхват шеи</span>
                        <span className={S.paramValue}>{neck}<span>см</span></span>
                    </div>
                    <div className={S.paramItem}>
                        <span className={S.paramTitle}>обхват талии</span>
                        <span className={S.paramValue}>{waist}<span>см</span></span>
                    </div>
                    { gender === 'female' && <div className={S.paramItem}>
                        <span className={S.paramTitle}>обхват бёдер</span>
                        <span className={S.paramValue}>{hip}<span>см</span></span>
                    </div>}
                </div>
            </div>
        ))
    }
    
    render() {
        const { user, isLoading } = this.state;

        if (!isLoading)
            return <></>

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: false,
              },
            },
            elements: {
                point: {
                    radius: window.innerWidth > 500 ? 5 : 3
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        autoSkipPadding: 4,
                        beginAtZero: true,
                        min: 0
                    }
                }
            }
        };
        const labels = user.bodyParameters.labels;
        const dataFat = {
            labels,
            datasets: [
                {
                label: '% жира',
                data: user.bodyParameters.fat,
                borderColor: '#2B50ED',
                backgroundColor: '#2B50ED',
                },
            ],
        };
        const dataWeight = {
            labels,
            datasets: [
                {
                label: 'Средний вес',
                data: user.bodyParameters.weight,
                borderColor: '#2B50ED',
                backgroundColor: '#2B50ED',
                },
            ],
        };
        return (
            <>
                <div className={S.chartBlock}>
                    <div className={S.chartContainer}>
                        <div className={S.chartHeader}>% жира</div>
                        <div>
                            <Line options={options} data={dataFat} />
                        </div>
                    </div>
                    <div className={S.chartContainer}>
                        <div className={S.chartHeader}>Средний вес</div>
                        <div>
                            <Line options={options} data={dataWeight} />
                        </div>
                    </div>
                </div>

                <h2 className={S.weeklyHistoryTitle}>Еженедельные отчёты</h2>
                <div className={S.weeklyHistory}>
                    {this.renderWeeklyBar()}
                </div>
            </>
        )
    }
}
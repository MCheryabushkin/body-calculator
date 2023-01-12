import React from "react";
import dataJSON from "../../assets/myParameters";
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import bodyApi from "../../api/bodyApi";
import { User } from "../../interfaces";

import * as S from "./Progress.scss";
import { getUserId } from "../../utils/util.helper";


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
    }

    getData = async () => {
        const userId = getUserId();
        const user: User = await bodyApi.getUserById(userId);
        this.setState({ user, isLoading: true });
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
                text: "% жира",
              },
            },
            elements: {
                point: {
                    radius: 5
                },
                line: {

                }
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
        )
    }
}
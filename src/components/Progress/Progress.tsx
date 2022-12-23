import React from "react";
import dataJSON from "../../assets/myParameters";

import * as S from "./Progress.scss";

export default class Progress extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    componentDidMount(): void {
    }

    render() {
        return (
            <div>
                <canvas id="lineChartExample" width="1180" height="300" className={S.canvas} ></canvas>
            </div>
        )
    }
}
import React from "react";
import cn from "classnames";

import * as S from './Calculator.scss';

interface IState {
    bodyParameters: any;
    isDisabled: boolean;
    fatPercentage: string | null;
}

export default class Calculator extends React.Component<{}, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            bodyParameters: {
                gender: null,
                // age: null,
                // weight: null,
                height: null,
                neck: null,
                waist: null,
                hip: null,
            },
            isDisabled: true,
            fatPercentage: null,
        }
    }

    bodyCalculate = (e: any) => {
        e.preventDefault();
        const {gender, neck, waist, height, hip} = this.state.bodyParameters;
        const fatPercentage: string = gender === 'male'
            ? (495/(1.0324 - 0.19077*Math.log10(waist-neck) + 0.15456*Math.log10(height))-450).toFixed(2)
            : (495/(1.29579 - 0.35004*Math.log10(waist+hip-neck) + 0.22100*Math.log10(height))-450).toFixed(2);
        this.setState({ fatPercentage });
    }

    onChangeParams = ({target: {name, value}}: any): any => {
        const {bodyParameters} = this.state;
        let isDisabled = false;
        bodyParameters[name] = name !== 'gender' ? parseFloat(value) : value;
        for (let param in bodyParameters) {
            if (param === 'hip') {
                if (bodyParameters['gender'] === 'female' && !bodyParameters[param])
                    isDisabled = true
            } else if (!bodyParameters[param]) isDisabled = true;
        }     
        this.setState({bodyParameters, isDisabled, fatPercentage: null}); 
    }
    render() {
        const {isDisabled, fatPercentage, 
            bodyParameters: {gender, height, neck, waist, hip}
        } = this.state;
        return (
            <div>
                <form action="none" className={S.form}>
                    <div className={S.radioBlock}>
                        <label><input type="radio" name="gender" value="male" onChange={this.onChangeParams} />Муж.</label>
                        <label><input type="radio" name="gender" value="female" onChange={this.onChangeParams} />Жен.</label>
                    </div>
                    {/* <div className={S.inputBlock}>
                        <label htmlFor="age">Возраст</label>
                        <input type="number" name="age" onChange={this.onChangeParams} />
                    </div>
                    <div className={S.inputBlock}>
                        <label htmlFor="weight">Вес</label>
                        <input type="number" name="weight" step="0.1" onChange={this.onChangeParams} />
                    </div> */}
                    <div className={S.inputBlock}>
                        <label htmlFor="height">Рост</label>
                        <input type="number" name="height" onChange={this.onChangeParams} value={height ? height : ''} />
                    </div>
                    <div className={S.inputBlock}>
                        <label htmlFor="neck">Обхват шеи</label>
                        <input type="number" name="neck" step="0.1" onChange={this.onChangeParams} value={neck ? neck : ''} />
                    </div>
                    <div className={S.inputBlock}>
                        <label htmlFor="waist">Обхват талии</label>
                        <input type="number" name="waist" step="0.1" onChange={this.onChangeParams} value={waist ? waist : ''} /> 
                    </div>
                    {gender === 'female' && <div className={S.inputBlock}>
                        <label htmlFor="hip">Обхват бёдер</label>
                        <input type="number" name="hip" step="0.1" onChange={this.onChangeParams} value={hip ? hip : ''} /> 
                    </div>}
                    <div className="form-example">
                        <button className={cn(S.btn, isDisabled && S.disabled)} onClick={this.bodyCalculate} disabled={isDisabled}>Рассчитать</button>
                    </div>
                </form>

                {fatPercentage && <div>
                        <h2>Ваш процент жира: {fatPercentage}%</h2>
                    </div>
                }
            </div>
        )
    }

}
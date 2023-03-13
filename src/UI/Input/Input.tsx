import React from "react";
import cn from 'classnames';

import * as S from "./Input.scss";

interface InputProps {
    type: string;
    label?: string | null;
    value?: any;
    name?: string;
    step?: string;
    required?: boolean;
    isError?: boolean;
    errorText?: string;
    onChange?: (value: any, name?: string) => void;
}

interface InputState {
    value: any;
}

export default class Input extends React.Component<InputProps, InputState> {

    constructor(props: InputProps) {
        super(props);

        this.state = {
            value: this.props.value,
        }
    }

    onChange = (e: any) => {
        const { value: inputValue, name, type } = e.target;
        const value = type === 'number' ? parseFloat(inputValue) : inputValue;
        
        this.setState({ value });
        if (this.props.onChange)
            this.props.onChange(value, name);
    }

    render() {
        const { name, label, required, isError, errorText } = this.props;
        const { value } = this.state;
        return (
            <div className={cn(S.inputContainer, isError && S.error)}> 
                <input {...this.props} 
                    className={S.input} 
                    placeholder={label} 
                    value={value ? value : ''}
                    onChange={this.onChange} 
                    id={name}
                />
                <label htmlFor={name} className={S.placeholder}>{label}</label>
                {required && <span className={S.requireStar}>*</span>}
                {isError && <span className={S.errorText}>{errorText}</span>}
            </div>
        )
    }
}
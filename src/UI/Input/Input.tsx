import React from "react";

import * as S from "./Input.scss";

interface InputProps {
    type: string;
    label?: string | null;
    value?: any;
    name?: string;
    step?: string;
    onChange?(value: any): () => void;
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
        const value = e.target.value;
        
        this.setState({ value });
        if (this.props.onChange)
            this.props.onChange(value);
    }

    render() {
        const { name, label } = this.props;
        const { value } = this.state;
        return (
            <div className={S.inputContainer}> 
                <input {...this.props} 
                    className={S.input} 
                    placeholder={label} 
                    value={value ? value : ''}
                    onChange={this.onChange} 
                />
                <label htmlFor={name} className={S.placeholder}>{label}</label>
            </div>
        )
    }
}
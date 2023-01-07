import React from "react";
import { BrowserRouter } from 'react-router-dom';
import bodyApi from "../../api/bodyApi";
import Header from '../Header/Header';
import Routes from '../Routes/Routes';

interface IState {
    isAuthorized: boolean | null;
}

export default class Layout extends React.Component<{}, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            isAuthorized: null,
        }
    }

    componentDidMount(): void {
        this.getAuthorize();
    }

    getAuthorize = async () => {
        const isAuthorized = await bodyApi.isAuthorizedUser(0);
        this.setState({ isAuthorized });
    }

    render() {
        const { isAuthorized } = this.state;

        if (isAuthorized === null)
            return <div>Loading</div>
        return (
            <BrowserRouter>
                {isAuthorized && <Header />}
                <Routes isAuthorized={isAuthorized} />
            </BrowserRouter>
        )
    }
}
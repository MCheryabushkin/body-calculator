import React from "react";
import { BrowserRouter } from 'react-router-dom';
import bodyApi from "../../api/bodyApi";
import Header from '../Header/Header';
import Routes from '../Routes/Routes';

interface IState {
    isAuthorized: boolean | null;
    userId: number | null;
}

export default class Layout extends React.Component<{}, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            isAuthorized: null,
            userId: 0,
        }
    }

    componentDidMount(): void {
        this.getUser();
        this.getAuthorize();
    }

    getUser = () => {
        const userId = parseInt(localStorage.getItem('userId'));
        if (userId) {
            this.setState({ userId });
        }
    }

    getAuthorize = async () => {
        const { userId } = this.state;
        if (typeof userId === 'number') {
            const isAuthorized = await bodyApi.isAuthorizedUser(0);
            this.setState({ isAuthorized });
        } else {
            this.setState({ isAuthorized: false });
        }
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
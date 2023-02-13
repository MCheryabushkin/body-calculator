import React from "react";
import { BrowserRouter } from 'react-router-dom';
import bodyApi from "../../api/bodyApi";
import { getUserId } from "../../utils/util.helper";
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
            userId: null,
        }
    }

    componentDidMount(): void {
        this.getAuthorize();
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<IState>, snapshot?: any): void {
        if (this.state.isAuthorized === null)
            this.getAuthorize()
    }

    getAuthorize = async () => {
        const userId = getUserId();
        if (userId !== null) {
            const isAuthorized = await bodyApi.isAuthorizedUser(userId);
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
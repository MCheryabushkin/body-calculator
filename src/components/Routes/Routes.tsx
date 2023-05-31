import React from "react";
import { Route, Routes as Router } from 'react-router-dom';
import Calculator from '../Calculator/Calculator';
import Home from '../Home/Home';
import Login from "../Login/Login";
import Progress from '../Progress/Progress';
import Registration from "../Registration/Registration";
import Help from "../Help/Help";

interface RouteProps {
    isAuthorized: boolean;
}

function Routes({isAuthorized}: RouteProps) {
    return (
        <Router>
            {/* @ts-ignore */}
            <Route exact path='/' element={isAuthorized ? <Home /> : <Login />} />
            <Route path='/registration' element={isAuthorized ? <Home /> : <Registration />} />
            <Route path='/login' element={isAuthorized ? <Home /> : <Login />} />
            <Route path='/calculator' element={isAuthorized ? <Calculator /> : <Login />} />
            <Route path='/progress' element={isAuthorized ? <Progress /> : <Login />} />
            <Route path='/help' element={isAuthorized ? <Help /> : <Login />} />
        </Router>
    )
}

export default Routes;
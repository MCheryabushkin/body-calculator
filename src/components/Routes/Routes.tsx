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
            <Route exact path='/body-calculator/' element={isAuthorized ? <Home /> : <Login />} />
            <Route path='/body-calculator/registration' element={isAuthorized ? <Home /> : <Registration />} />
            <Route path='/body-calculator/login' element={isAuthorized ? <Home /> : <Login />} />
            <Route path='/body-calculator/calculator' element={isAuthorized ? <Calculator /> : <Login />} />
            <Route path='/body-calculator/progress' element={isAuthorized ? <Progress /> : <Login />} />
            <Route path='/body-calculator/help' element={isAuthorized ? <Help /> : <Login />} />
        </Router>
    )
}

export default Routes;
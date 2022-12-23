import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Calculator from '../Calculator/Calculator';
import Header from '../Header/Header';
import Progress from '../Progress/Progress';

import * as S from "./App.scss";

const App = () => {
    return (
        <div className={S.container}>
            <BrowserRouter>
                <Header key={`${location.href}`} />
                <Routes>
                    <Route path='/' />
                    <Route path='/calculator' element={<Calculator />} />
                    <Route path='/progress' element={<Progress />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
};

export default App;
import React from 'react';
import * as KeepAlive from 'react-keep-alive';
import { MemoryRouter as Router, Route } from 'react-router-dom'
import { keepAliveCacheContext } from './utils/keep-alive.context';
import { ConfigProvider } from 'antd';
import Menu from './views/menu/menu';
import Main from './views/main/main';
import zhCN from 'antd/es/locale-provider/zh_CN';

import 'normalize.css';
import 'minireset.css';
import 'antd/dist/antd.css';
import './app.scss';

class App extends React.Component {

    // 1. Create an object that controls all <KeepAlive> components disabled
    state = {
        controlDisableds: {}
    }

    // 2. Create a method to modify controlDisableds
    setControlDisabled = (key, value) => {
        this.setState(({ controlDisableds }) => {
            const result = { ...controlDisableds };
            result[key] = value;
            return {
                controlDisableds: result
            };
        });
    };

    render() {
        return (
            <ConfigProvider locale={zhCN}>
                <Router>
                    <keepAliveCacheContext.Provider value={{
                        controlDisableds: this.state.controlDisableds,
                        setControlDisabled: this.setControlDisabled
                    }}>
                        <KeepAlive.Provider include={/.+/}>
                            <div className="app">
                                <Route path="/" exact component={Menu} />
                                <Route path="/main" component={Main} />
                            </div>
                        </KeepAlive.Provider>
                    </keepAliveCacheContext.Provider>
                </Router>
            </ConfigProvider>
        );
    }
}

export default App;

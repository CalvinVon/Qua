import React from 'react';
import { Provider } from 'react-keep-alive';
import { MemoryRouter as Router, Route } from 'react-router-dom'
import Menu from './views/menu/menu';
import Main from './views/main/main';

import 'normalize.css';
import 'minireset.css';
import 'antd/dist/antd.css';
import './app.scss';

class App extends React.Component {

    render() {
        return (
            <Router>
                <Provider include={/.+/}>
                    <div className="app">
                        <Route path="/" exact component={Menu} />
                        <Route path="/main" component={Main} />
                    </div>
                </Provider>
            </Router>
        );
    }
}

export default App;

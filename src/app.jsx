import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Menu from './views/main/menu';
import Main from './views/main/main';

import 'normalize.css';
import 'minireset.css';
import './app.scss';

class App extends React.Component {

    render() {
        return (
            <Router>
                <div className="app">
                    <Route path="/" exact component={Menu} />
                    <Route path="/main" component={Main} />
                </div>
            </Router>
        );
    }
}

export default App;

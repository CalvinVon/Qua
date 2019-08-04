import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Schedule from './views/schedule';

import 'normalize.css';
import './app.scss';

function App() {
    return (
        <Router>
            <div className="app">
                <div className="app-side">
                    <ul>
                        <li className="app-side-item">
                            <Link to="/schedule">课程表</Link>
                        </li>
                        <li className="app-side-item">
                            <Link to="/reminder">提醒列表</Link>
                        </li>
                        <li className="app-side-item">
                            <Link to="/transfer">文件传输</Link>
                        </li>
                    </ul>
                </div>

                <div className="app-content">
                    <Route path="/schedule" component={Schedule} />
                </div>
            </div>
        </Router>
    );
}

export default App;

import React from 'react';
import { Route, Link } from 'react-router-dom';
import routes from '../../routes';

import './main.scss';

class Main extends React.Component {

    state = {
        nav: routes.map(route => {
            return {
                ...route,
                active: false
            };
        })
    }
    componentWillMount() {
        this.handleActive(0);
    }

    render() {
        return (
            <div className="main">
                <div className="main-side">
                    {this.renderNav()}
                </div>

                <div className="main-content">
                    {this.renderRouterOutlet()}
                </div>
            </div>
        );
    }

    renderNav() {
        return (
            <ul>
                {
                    this.state.nav.map((it, idx) => (
                        <li className={'main-side-item' + (it.active ? ' active' : '')}
                            onClick={this.handleActive.bind(this, idx)}
                            key={it.name}>
                            <Link to={it.path}>
                                <span>{it.name}</span>
                            </Link>
                        </li>
                    ))
                }
            </ul>
        );
    }

    renderRouterOutlet() {
        return this.state.nav.map(it => (
            <Route path={it.path} component={it.component} />
        ));
    }

    handleActive(index) {
        const { nav } = this.state;
        nav.forEach((it, idx) => {
            if (idx === index) {
                it.active = true;
            }
            else {
                it.active = false;
            }
        });

        this.setState({
            nav: [...nav]
        });
    }
}

export default Main;

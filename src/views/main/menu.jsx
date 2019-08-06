import React from 'react';
import { Affix } from 'antd';
import Sortable from 'react-sortablejs';

import routes from '../../routes';
import './menu.scss';

export default class Menu extends React.Component {

    render() {
        return (
            <div className="menu">
                <Affix>
                    <h3 className="menu-header">Qua 啾呀</h3>
                </Affix>
                <Sortable className="menu-list"
                    items={routes}
                    onChange={(items) => {
                        console.log(items)
                    }}>
                    {
                        routes.map(route => this.renderRouteItem(route))
                    }
                </Sortable>
            </div>
        );
    }

    renderRouteItem(route) {
        const isDev = route.inDev;
        return (
            <div className={`menu-list-item route-item ${isDev ? 'route-item--dev' : ''}`}
                key={route.path}
                onClick={this.handleRouteClick.bind(this, route)}>
                <h3>{route.name}</h3>
                <p>{route.desc}</p>
                {
                    isDev ?
                        <span>正在开发中</span> :
                        <button className="route-item-button">开始</button>
                }
            </div>
        );
    }

    handleRouteClick(route) {
        if (route.inDev) return;
        const { history } = this.props;
        history.push(route.path);
    }
}
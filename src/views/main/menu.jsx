import React from 'react';
import { Link } from 'react-router-dom';
import { Affix } from 'antd';

import routes from '../../routes';
import './menu.scss';

export default class Menu extends React.Component {
    render() {
        return (
            <div className="menu">
                <Affix>
                    <h3 className="menu-header">Qua 啾呀</h3>
                </Affix>
                <div className="menu-list">
                    {
                        routes.map(route => this.renderRouteItem(route))
                    }
                </div>
            </div>
        );
    }

    renderRouteItem(route) {
        return (
            <Link className="menu-list-item route-item" to={route.path} key={route.path}>
                <h3>{route.name}</h3>
                <p>{route.desc}</p>
                {
                    route.inDev ?
                        <span>正在开发中</span> :
                        <button className="route-item--button">开始</button>
                }
            </Link>
        );
    }
}
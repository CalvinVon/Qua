import React from 'react';
import { Affix, Badge, Popconfirm, Icon } from 'antd';
import Sortable from 'react-sortablejs';

import RouteHelper from '../../utils/route.helper';
import RunningHelper from '../../utils/running.helper';
import './menu.scss';

export default class Menu extends React.Component {

    runningSubscription;

    state = {
        menuItems: RouteHelper.getRouteMetas()
    }

    render() {
        return (
            <div className="menu">
                <Affix>
                    <h3 className="menu-header">Qua 啾呀</h3>
                </Affix>
                <Sortable className="menu-list"
                    onChange={this.handleReorder.bind(this)}>
                    {
                        this.state.menuItems.map(route => this.renderRouteItem(route))
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
                data-id={route.path}
            >
                <h3>{route.name}</h3>
                <p>{route.desc}</p>
                {
                    isDev ?
                        <span>正在开发中</span> :
                        <button className="route-item-button"
                            onClick={this.handleRouteClick.bind(this, route)}>开始</button>
                }

                {
                    RunningHelper.isRunning(route) ?
                        (
                            <Popconfirm
                                title="停止实例运行？"
                                placement="bottomRight"
                                trigger="hover"
                                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                onConfirm={this.handleStopRunning.bind(this, route)}
                            >
                                <Badge status="processing" text="运行中" />
                            </Popconfirm>
                        )
                        :
                        null
                }
            </div>
        );
    }

    componentDidMount() {
        this.runningSubscription = RunningHelper.subscribe((widget) => {
            const route = widget.route;
            const menuItems = [...this.state.menuItems, route];
            RouteHelper.setRouteMetas(menuItems);
            this.setState({
                menuItems
            });
        })
    }

    componentWillUnmount() {
        this.runningSubscription.unsubscribe();
    }

    handleRouteClick(route) {
        if (route.inDev) return;
        
        const { history } = this.props;
        history.push(route.path);
    }

    handleStopRunning(route) {
        route.running = false;
        const menuItems = [...this.state.menuItems];

        // unmount component

        this.setState({
            menuItems
        });
    }

    handleReorder(idList) {
        const menuItems = idList.map(id => this.state.menuItems.find(it => it.path === id));
        RouteHelper.setRouteMetas(menuItems);
        this.setState({
            menuItems: RouteHelper.getRouteMetas()
        })
    }
}
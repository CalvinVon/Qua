import React from 'react';
import { Affix, Badge, Popconfirm, Icon } from 'antd';
import Sortable from 'react-sortablejs';

import RouteHelper from '../../utils/route.helper';
import RunningHelper from '../../utils/running.helper';
import { keepAliveCacheContext } from '../../utils/keep-alive.context';
import './menu.scss';

const menuItems = RouteHelper.getRouteMetas();
let runningSubscription;
export default class Menu extends React.Component {

    static contextType = keepAliveCacheContext;

    state = {
        menuItems: menuItems,
        runningList: menuItems.map(it => RunningHelper.isRunning(it.path)),
    }

    componentDidMount() {
        runningSubscription = RunningHelper.subscribe(() => {
            this.setState({
                runningList: this.state.menuItems.map(it => RunningHelper.isRunning(it.path))
            });
        })
    }

    componentWillUnmount() {
        runningSubscription.unsubscribe();
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
                        this.state.menuItems.map((route, routeIndex) => this.renderRouteItem(route, routeIndex))
                    }
                </Sortable>
            </div>
        );
    }

    renderRouteItem(route, routeIndex) {
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
                    this.state.runningList[routeIndex] ?
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

    handleRouteClick(route) {
        if (route.inDev) return;

        // 只有在运行的 widget，才不设置 disable keep-alive cache
        if (RunningHelper.isRunning(route.path)) {
            this.context.setControlDisabled(route.path, false);
        }
        const { history } = this.props;
        history.push(route.path);
    }

    handleStopRunning(route) {
        RunningHelper.stop(route.path);
        this.context.setControlDisabled(route.path, true);
    }

    handleReorder(idList) {
        const menuItems = idList.map(id => this.state.menuItems.find(it => it.path === id));
        RouteHelper.setRouteMetas(menuItems);
        this.setState({
            menuItems: RouteHelper.getRouteMetas(),
            runningList: menuItems.map(it => RunningHelper.isRunning(it.path)),
        })
    }
}
import React from 'react';
import { Route, Link } from 'react-router-dom';
import { KeepAlive } from 'react-keep-alive';
import { Drawer, Icon, PageHeader, Badge } from 'antd';
import classNames from 'classnames';

import utils from '../../utils/common.utils';
import RouteHelper from '../../utils/route.helper';
import RunningHelper from '../../utils/running.helper';
import { keepAliveCacheContext } from '../../utils/keep-alive.context';
import './main.scss';

const menuItems = RouteHelper.getRouteMetas();
let runningSubscription;

class Main extends React.Component {

    static contextType = keepAliveCacheContext;

    state = {
        nav: menuItems,
        runningList: menuItems.map(it => RunningHelper.isRunning(it.path)),
        activeIndex: -1,
        menuVisible: false
    }

    componentWillMount() {
        const { pathname } = this.props.location;
        const { nav } = this.state;

        this.handleActive(nav.findIndex(it => it.path === pathname));
    }

    componentDidMount() {
        runningSubscription = RunningHelper.subscribe(() => {
            this.setState({
                runningList: this.state.nav.map(it => RunningHelper.isRunning(it.path))
            });
        })
    }

    componentWillUnmount() {
        runningSubscription.unsubscribe();
    }

    render() {
        return (
            <div className="main">
                <div className="main-header">
                    <PageHeader onBack={this.showDrawer} title={this.activeNav.name} subTitle={this.activeNav.desc} />
                </div>
                <div className="main-content">
                    {this.renderRouterOutlet()}
                </div>
                {this.renderNavDrawer()}
            </div>
        );
    }

    renderNavDrawer() {
        const { nav, activeIndex, runningList } = this.state;
        return (
            <Drawer
                className="main-nav-drawer"
                title={<div onClick={() => this.backMenu()}>Qua 啾呀<Icon type="rollback" /></div>}
                placement="left"
                closable={false}
                onClose={this.onClose}
                visible={this.state.menuVisible}
            >
                <div className="main-nav">
                    <ul>
                        {
                            nav.map((it, idx) => (
                                <li className={classNames('main-nav-item', { 'active': activeIndex === idx, 'in-dev': it.inDev })}
                                    onClick={this.handleActive.bind(this, idx)}
                                    key={it.name}>
                                    {
                                        it.inDev ?
                                            <a href="javascript:;">
                                                <span className="nav-text">{it.name}</span>
                                            </a>
                                            :
                                            <Link to={it.path} key={it.name}>
                                                <span className="nav-text">
                                                    {it.name}
                                                </span>
                                                {
                                                    runningList[idx] ?
                                                        (<Badge status="processing" />) :
                                                        null
                                                }
                                            </Link>
                                    }
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </Drawer>
        );
    }

    renderRouterOutlet() {
        return this.state.nav.map(it => (
            <Route path={it.path} key={it.path} render={() => {
                const TagName = RouteHelper.getRouteComponent(it.path);
                return (
                    <KeepAlive name={it.path}
                        // 3. Assign the corresponding <KeepAlive> component
                        disabled={this.context.controlDisableds[it.path]}>
                        <TagName />
                    </KeepAlive>
                )
            }} />

        ));
    }

    get activeNav() {
        return this.state.nav[this.state.activeIndex];
    }

    handleActive(index) {
        if (this.state.nav[index].inDev) return;

        this.setState({
            activeIndex: index
        });
    }

    showDrawer = () => {
        this.setState({
            menuVisible: true,
        });
    };

    onClose = () => {
        this.setState({
            menuVisible: false,
        });
    };

    backMenu() {
        this.props.history.push('/');
    }
}

export default Main;

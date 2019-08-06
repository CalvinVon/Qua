import React from 'react';
import { Route, Link } from 'react-router-dom';
import { KeepAlive } from 'react-keep-alive';
import { Drawer, Icon, PageHeader } from 'antd';
import classNames from 'classnames';

import RouteHelper from '../../utils/route.helper';
import './main.scss';

let activeIndex;

class Main extends React.Component {

    state = {
        nav: RouteHelper.getRouteMetas().map(route => {
            return {
                ...route,
                active: false
            };
        }),
        menuVisible: false
    }
    componentWillMount() {
        const { pathname } = this.props.location;
        const { nav } = this.state;

        this.handleActive(nav.findIndex(it => it.path === pathname));
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
                            this.state.nav.map((it, idx) => (
                                <li className={classNames('main-nav-item', { 'active': it.active, 'in-dev': it.inDev })}
                                    onClick={this.handleActive.bind(this, idx)}
                                    key={it.name}>
                                    {
                                        it.inDev ?
                                            <a href="javascript:;">
                                                <span>{it.name}</span>
                                            </a>
                                            :
                                            <Link to={it.path} key={it.name}>
                                                <span>{it.name}</span>
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
                    <KeepAlive name={it.path}>
                        <TagName />
                    </KeepAlive>
                )
            }} />

        ));
    }

    get activeNav() {
        return this.state.nav[activeIndex];
    }

    handleActive(index) {
        if (this.state.nav[index].inDev) return;

        activeIndex = index;

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

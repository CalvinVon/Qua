import React from 'react';
import { Affix, Input, Icon, Button } from 'antd';
import classnames from 'classnames';
import RunningHelper from '../../utils/running.helper';
import './index.scss';

const isUrl = window.require('is-url');
const generateWnRunUrl = url => `https://wn.run/${url}`;

export default class WnRun extends React.Component {

    state = {
        value: '',
        isUrl: false,
        url: null,
    }

    componentDidMount() {
        RunningHelper.add(this);
    }

    render() {
        const { url, value, isUrl } = this.state;
        return (
            <div className={classnames('wn-run', { 'has-result': url })}>

                {
                    url ?
                        null :
                        <div className="wn-run-header">
                            <span>🧰 万能工具</span>
                        </div>
                }

                <Affix offsetTop={10} className="search-affix">
                    <div className="input-wrapper">
                        <Input
                            value={value}
                            onChange={this.handleValueChange.bind(this)}
                            onPressEnter={this.handleEnter.bind(this)}
                            allowClear
                            placeholder="输入网址或者关键词搜索" />

                        <Button className="input-btn" onClick={this.handleBtnClick.bind(this)}>
                            {
                                isUrl ?
                                    <Icon type="arrow-right" /> :
                                    <Icon type="search" />
                            }
                        </Button>

                        {
                            url ?
                                <Button className="close-btn" type="primary" onClick={() => this.setState({ url: null })}>
                                    <Icon type="close" />
                                </Button> :
                                null
                        }
                    </div>

                </Affix>

                {
                    url ?
                        <webview ref={this.bindWebviewClick.bind(this)}
                            className="wn-run-webcontent"
                            src={this.state.url}></webview>
                        : null
                }
            </div>
        )
    }

    handleValueChange({ target: { value } }) {
        this.setState({
            value,
            isUrl: isUrl(value)
        });
    }

    handleEnter() {
        this.handleBtnClick();
    }

    handleBtnClick() {
        const { isUrl, value } = this.state;
        if (isUrl) {
            const target = generateWnRunUrl(value);
            this.setState({
                url: target
            });
        }
        else {

        }
    }

    // webview 内点击事件
    bindWebviewClick(webview) {
        if (webview) {
            webview && webview.addEventListener('new-window', ({ url }) => {
                webview.loadURL(url);
            });
        }
    }
}
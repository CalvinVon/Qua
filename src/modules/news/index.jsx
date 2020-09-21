import React from 'react';
import Crawler from './crawler';
import { Tabs, Button, PageHeader } from 'antd';
import RunningHelper from '../../utils/running.helper';
import Panel from './panel';
import './index.scss';

const TabPane = Tabs.TabPane;

export default class News extends React.Component {

    webView;

    state = {
        // started from 1
        activeIndex: 1,
        loading: false,
        selected: null,

        baiduNews: [],
        weiboNews: [],
        hao123News: [],
    }

    componentDidMount() {
        RunningHelper.add(this);

        this.getBaiduNews();
        this.getHao123News();
    }

    render() {
        const { baiduNews, weiboNews, hao123News, loading } = this.state;
        const operations = <Button onClick={this.handleRefresh.bind(this)}>刷新</Button>;
        return (
            <div className="news">
                <Tabs tabBarExtraContent={operations} onChange={this.handleTabChange.bind(this)}>
                    <TabPane tab="百度热搜" key="1">
                        <Panel newsList={baiduNews} loading={loading} onItemClick={this.handleItemClick.bind(this)} />
                    </TabPane>
                    <TabPane tab="微博热搜" key="2">
                        <Panel newsList={weiboNews} loading={loading} onItemClick={this.handleItemClick.bind(this)} />
                    </TabPane>

                    {
                        hao123News.map((item, index) => (
                            <TabPane tab={item.cate} key={index + 3}>
                                <Panel newsList={item.list} onItemClick={this.handleItemClick.bind(this)} />
                            </TabPane>
                        ))
                    }
                </Tabs>


                {
                    this.state.selected ?
                        <div className="news-preview">
                            <div className="news-preview-header">
                                <PageHeader onBack={this.handleItemClick.bind(this, null)}
                                    title={<span>📰 预览</span>}
                                    subTitle={this.state.selected.name} />
                            </div>
                            <webview ref={this.handleViewShow.bind(this)}
                                src={this.state.selected.link}
                                title={this.state.selected.name}
                                nodeintegration="true"></webview>
                        </div>
                        :
                        null
                }

            </div>
        )
    }

    async handleRefresh() {
        const requests = [
            this.getBaiduNews,
            this.getWeiboNews,
            this.getHao123News
        ];

        this.setState({
            loading: true
        });
        await (requests[this.state.activeIndex - 1] || this.getHao123News).call(this);

        this.setState({
            loading: false
        });
    }

    async handleTabChange(index) {
        const requests = [
            this.getBaiduNews,
            this.getWeiboNews,
            this.getHao123News
        ];

        this.setState({
            activeIndex: index,
            loading: true
        });

        await (requests[index - 1] || this.getHao123News).call(this);

        this.setState({
            loading: false
        });
    }

    handleItemClick(news) {
        const webview = this.webView;
        if (!news) {
            if (webview.canGoBack()) {
                webview.goBack();
            }
            else {
                this.setState({
                    selected: news
                });
            }
        }
        else {
            this.setState({
                selected: news
            });
            webview && webview.clearHistory();
        }
    }

    handleViewShow(webview) {
        this.webView = webview;
        webview && webview.addEventListener('new-window', ({ url }) => {
            webview.loadURL(url);
        });
    }

    async getBaiduNews() {
        this.setState({
            baiduNews: await Crawler.getBaiduNews()
        });
    }

    async getWeiboNews() {
        this.setState({
            weiboNews: await Crawler.getWeiboNews()
        });
    }

    async getHao123News() {
        this.setState({
            hao123News: await Crawler.getHao123News()
        });
    }
}
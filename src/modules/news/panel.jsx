import React from 'react';
import { List, Tag, Icon, Statistic } from 'antd';
import classNames from 'classnames';

export default function Panel({ newsList, header, loading, onItemClick }) {
    return (
        <div className="news-panel">
            <List
                header={header}
                bordered
                dataSource={newsList}
                loading={loading}
                renderItem={news => {
                    const { isNew, isRising, isDeclining, isRoof, isHot, isBoil, extraImage } = news;
                    return (
                        <List.Item className={classNames('news-item', { isRoof })}
                            key={news.link}
                            onClick={onItemClick.bind(null, news)}>
                            <div className="news-index">
                                {
                                    isRoof ?
                                        <Icon type="vertical-align-top" /> :
                                        <Tag color={
                                            [
                                                '#f50',
                                                '#ff9800',
                                                '#ffc107'
                                            ][news.index - 1] || ''
                                        }>{news.index}</Tag>
                                }
                            </div>
                            <div className="news-name">
                                <span>{news.name}</span>
                                {
                                    extraImage ?
                                        <img src={extraImage} alt={news.name} /> :
                                        null
                                }

                                <div className="news-name-icon">
                                    {
                                        isNew ? <Tag color="#2db7f5">新</Tag> : null
                                    }
                                    {
                                        isRising ? <Tag color="green"><Icon type="caret-up" /></Tag> : null
                                    }
                                    {
                                        isDeclining ? <Tag color="orange"><Icon type="caret-down" /></Tag> : null
                                    }
                                    {
                                        isHot ? <Tag color="#f50">热</Tag> : null
                                    }
                                    {
                                        isBoil ? <Tag color="#e91e63">沸</Tag> : null
                                    }
                                </div>
                            </div>
                            <div className="news-count">
                                {
                                    news.count ?
                                        <Statistic value={news.count} /> :
                                        null
                                }
                            </div>
                        </List.Item>
                    )
                }}
            />
        </div >
    )
}
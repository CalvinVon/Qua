import React from 'react';
import $ from 'jquery';
import { Modal, Button, Tooltip, Popover, List, Avatar } from 'antd';

import ExcelParser from './parse-excel';
import { Student, Group } from './parse-excel/entity';
import RunningHelper from '../../utils/running.helper';
import StorageManager from '../../utils/storage.manager';

import '../decider/index.scss';
import './index.scss';

const defaultConfig = {
    // 最多选择个数
    select: 1,
    // 是否开启自动连选
    automatic: true
};

const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];


export default class ExcelLottery extends React.Component {
    storage = new StorageManager('ExcelLottery-excel-content');
    timer = null;
    btnColorTimer = null;

    state = {
        running: false,
        btnColor: null,

        list: this.storage.get() || [],
        selectedList: [],

        config: defaultConfig,
    }

    componentDidMount() {
        RunningHelper.add(this);
    }

    render() {
        return (
            <div className="excel-lottery decider">
                <article id="martix" className={this.state.running ? 'stop' : ''}>
                    {
                        this.state.selectedList.length
                            ? <p id="title">🎉 恭喜下列中奖的同学！</p>
                            : null
                    }

                    <p id="unicorn" style={{
                        visibility: this.state.running
                            ? 'unset'
                            : 'hidden'
                        ,
                        color: this.state.btnColor
                    }}></p>


                    <Tooltip title={this.state.list.length ? '开始之前可以点下方按钮配置选项' : '先添加学生列表文件哟'}>
                        {
                            this.state.list.length ?
                                <React.Fragment>
                                    <Popover
                                        overlayClassName="imported-popover"
                                        trigger="click"
                                        title={`查看列表：从文件中已经导入 ${this.state.list.length} 个数据`}
                                        content={this.renderStudentTable()}>
                                        <span className="imported-count">已导入 {this.state.list.length} 个数据</span>
                                    </Popover>

                                    <br />
                                    <Button type="primary"
                                        id="pick"
                                        onClick={() => this.runLottery()}
                                        disabled={!this.state.list.length}>
                                        {
                                            this.state.running
                                                ? '就你了~'
                                                : '开始吧 !'
                                        }
                                    </Button>
                                </React.Fragment>
                                :
                                <Button type="primary"
                                    onClick={() => this.importExcel()}
                                    className="import-btn">导入 Excel</Button>
                        }
                    </Tooltip>

                    <br />

                    <Button type="link"
                        className="config-btn">选项</Button>
                </article>
            </div>
        );
    }


    renderStudentTable() {

        return (
            <div className="imported-list">
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 4,
                        lg: 4,
                        xl: 6,
                        xxl: 3,
                    }}
                    itemLayout="horizontal"
                    dataSource={this.state.list}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar style={{ backgroundColor: colorList[Math.round(Math.random() * colorList.length)] }}>{item.name[0]}</Avatar>}
                                title={item.name}
                                description={`学号:${item.id}  组:${Group.toString(item.group)}`}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }


    runLottery() {
        let unicorn = document.getElementById('unicorn');
        let lollipop = this.state.list;

        if (!this.state.running) {
            this.btnColorTimer = setInterval(() => {
                const index = Math.round(Math.random() * colorList.length);
                this.setState({
                    btnColor: colorList[index]
                });
            }, 500);
            this.timer = setInterval(() => {
                let props = Math.ceil(Math.random() * lollipop.length),
                    propsTop = Math.ceil((Math.random() * (window.document.body.offsetHeight - 48)) + 48),
                    propsLeft = Math.ceil(Math.random() * (window.document.body.offsetWidth - 140)),
                    propsSize = Math.ceil(Math.random() * (26 - 12) + 12),
                    propsBlur = ((26 - propsSize) / 12) * 4,
                    surge = lollipop[props - 1],
                    telegram = document.createElement('div');
                telegram.setAttribute('class', 'telegram');
                telegram.innerText = Student.toString(surge);
                unicorn.innerText = Student.toString(surge);
                telegram.style.cssText = `
                    top: ${propsTop}px;
                    left: ${propsLeft}px;
                    color: "rgba(0,0,0,." + Math.random() + ")";
                    font-size: ${propsSize}px;
                    filter: blur(${propsBlur}px)`;
                $('.decider').append(telegram);
                // 动画
                $('.telegram').fadeIn("slow", function () {
                    $(this).fadeOut("slow", function () {
                        $(this).remove();
                    });
                });
                this.setState({
                    running: true
                });
            }, 1000 / 45);
        }
        else {
            clearInterval(this.timer);
            clearInterval(this.btnColorTimer);
            this.setState({
                running: false
            });
        }
    }


    importExcel() {
        let ipt = document.createElement('input');
        ipt.type = 'file';
        ipt.onchange = async e => {
            const file = e.target.files[0];
            const filePath = file.path;

            const student = await ExcelParser(filePath);
            this.setState({
                list: student
            });

            this.storage.set(student);
            ipt = null;
        };

        ipt.click();
    }

}

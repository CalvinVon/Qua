import React from 'react';
import $ from 'jquery';
import {
    Modal,
    Button,
    Tooltip,
    Popover,
    List,
    Avatar,
    Progress,
    Form,
    InputNumber,
    Switch
} from 'antd';
import classnames from 'classnames';

import ExcelParser from './parse-excel';
import { Student, colors as colorList } from './parse-excel/entity';
import RunningHelper from '../../utils/running.helper';
import StorageManager from '../../utils/storage.manager';

import '../decider/index.scss';
import './index.scss';

const defaultConfig = {
    // 是否允许重复选中
    allowRepeat: false,
    // 最多选择个数
    maxSelect: 1,
    // 是否开启自动连选
    automatic: false,
    autoInterval: 500
};



class ExcelLottery extends React.Component {
    storage = new StorageManager('ExcelLottery-excel-content');
    timer = null;
    btnColorTimer = null;
    selectedStudent;

    ref = React.createRef();

    state = {
        stopped: true,  // 手动停止的标志
        running: false, // 正在抽奖的标志
        btnColor: null,
        configModal: false,

        fileName: '',
        // 文件导入的总共数据
        list: (this.storage.get() || []).map(Student.create),
        // 已选中的数据
        selectedList: [],
        // 剩下的数据
        leftList: [],

        config: defaultConfig,
    }

    componentDidMount() {
        RunningHelper.add(this);
    }

    render() {
        const { running, list, selectedList, btnColor, config } = this.state;
        const { maxSelect } = config;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        return (
            <div className="excel-lottery decider">
                <article id="martix" className={classnames({
                    'stop': running,
                    'no-selected': !selectedList.length
                })}>
                    {
                        selectedList.length
                            ? <React.Fragment>
                                <p id="title">🎉 恭喜下列中奖的同学！</p>
                                {
                                    maxSelect === 1
                                        ? null
                                        : this.renderSelectedList(selectedList)

                                }
                            </React.Fragment>
                            : null
                    }

                    <div id="unicorn" style={{
                        color: btnColor
                    }}>
                        <span ref={this.ref}>抽个奖吧</span>
                        <Progress percent={+(selectedList.length / maxSelect * 100).toFixed(0)} status="active" />
                    </div>


                    <Tooltip title={list.length ? '开始之前可以点下方按钮配置选项' : '先添加学生列表文件哟'}>
                        {
                            list.length ?
                                <React.Fragment>
                                    <Popover
                                        overlayClassName="imported-popover"
                                        trigger="click"
                                        title={
                                            (<p>
                                                <span className="title">查看列表：从文件中已经导入 {list.length} 个数据</span>
                                                <Button className="reimport-btn" type="link" onClick={() => this.reImport()}>重新导入</Button>
                                            </p>)
                                        }
                                        content={this.renderStudentTable(list)}>
                                        <div className="imported-count">
                                            <Tooltip title="点击查看全部人员">
                                                <p className="imported-text">
                                                    {
                                                        this.state.fileName
                                                            ? <>
                                                                <span className="filename">{this.state.fileName}</span>
                                                                <br />
                                                            </>
                                                            : null
                                                    }
                                                    <span>已导入 {list.length} 个数据，将抽取 {maxSelect} 个幸运儿</span>
                                                </p>
                                            </Tooltip>
                                            <Button className="reimport-btn" type="link" onClick={() => this.reImport()}>重新导入</Button>
                                        </div>

                                    </Popover>

                                    <br />
                                    <Button type="primary"
                                        id="pick"
                                        onClick={() => this.runLottery()}
                                        disabled={!list.length}>
                                        {
                                            running
                                                ? (selectedList.length + 1 === maxSelect ? '完成抽奖' : '就你了~')
                                                : (selectedList.length === maxSelect ? '重新抽奖' : '开始吧 !')
                                        }
                                    </Button>

                                    {
                                        running
                                            ? <Button type="danger"
                                                className="stop-btn"
                                                onClick={() => this.runLottery('stop')}>取消</Button>
                                            : null
                                    }
                                </React.Fragment>
                                :
                                <Button type="primary"
                                    onClick={() => this.importExcel()}
                                    className="import-btn">导入 Excel</Button>
                        }
                    </Tooltip>

                    <br />

                    <Button type="link"
                        className="config-btn"
                        onClick={() => this.openConfigModal()}>选项</Button>


                    {/* 选项模态框 */}
                    <Modal
                        title="配置选项"
                        visible={this.state.configModal}
                        onOk={() => this.resetConfig()}
                        onCancel={() => this.cancelConfig()}
                    >

                        <Form layout="vertical">
                            <Form.Item label="设置抽奖人数" extra={`最少设置 1 人，最多可以设置 ${list.length} 人`}>
                                {getFieldDecorator('maxSelect')(<InputNumber max={list.length} min={1} />)}
                            </Form.Item>

                            <Form.Item label="是否允许重复抽中" extra="开启后，有可能性将多次抽中同一人">
                                {getFieldDecorator('allowRepeat', { valuePropName: 'checked' })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
                            </Form.Item>

                            <Form.Item label="设置自动连选" extra="保持一定间隔自动抽出中奖人">
                                {getFieldDecorator('automatic', { initialValue: config.automatic, valuePropName: 'checked' })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
                            </Form.Item>


                            <Form.Item label="自动连选间隔（毫秒）" extra="自动抽奖之前时间间隔">
                                {getFieldDecorator('autoInterval', { preserve: true })(<InputNumber max={5000} min={200} step={100} disabled={!getFieldValue('automatic')} />)}
                            </Form.Item>
                        </Form>
                    </Modal>
                </article>
            </div>
        );
    }


    renderStudentTable(data, opt) {
        const {
            showIndex = false,
            onClick = () => null
        } = opt || {};
        return (
            <div className="imported-list">
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item, index) => (
                        <List.Item onClick={onClick.bind(null, item, data.length - index)}>
                            <List.Item.Meta
                                avatar={<Avatar style={{ backgroundColor: item.color }}>{item.name.slice(item.name.length - 2)}</Avatar>}
                                title={(showIndex ? `#${data.length - index} ` : ' ') + item.name}
                                description={Student.toFullString(item)}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }

    renderSelectedList(data) {
        return (
            <div className="selected-list">
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item, index) => (
                        <Tooltip title={Student.toFullString(item)}>
                            <Avatar
                                onClick={() => {
                                    this.ref.current.innerText = `#${index} ${item.name}`;
                                }}
                                style={{ backgroundColor: item.color }}>{item.name.slice(item.name.length - 2)}</Avatar>
                        </Tooltip>
                    )}
                />
            </div>
        );
    }


    runLottery(shouldStop) {
        let unicorn = this.ref.current;
        const { running, stopped, list, config } = this.state;
        const { allowRepeat, maxSelect, automatic, autoInterval } = config;

        const stopLotteryTimer = () => {
            clearInterval(this.timer);
            clearInterval(this.btnColorTimer);
        };

        // 选中！
        const selectLottery = (cb) => {
            const newState = {
                selectedList: [...this.state.selectedList, this.selectedStudent]
            };

            // 若不允许重复
            if (!allowRepeat) {
                newState.leftList = this.state.leftList.filter(it => it !== this.selectedStudent);
            }

            // 除非是全部抽奖完了，否则不停止
            if (newState.selectedList.length === maxSelect) {
                newState.running = false;
                newState.stopped = true;
                stopLotteryTimer();
                this.setState(newState, () => {
                    cb && cb(true);
                });
            }
            else {
                this.setState(newState, () => {
                    cb && cb();
                });
            }
        };

        // 是否要停止
        if (shouldStop) {
            stopLotteryTimer();
            this.setState({
                running: false,
                stopped: true
            });
            return;
        }

        // 若不在抽奖中
        if (!running) {
            const run = () => {
                stopLotteryTimer();

                let lollipop = this.state.leftList;
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
                        propsSize = Math.ceil(Math.random() * (50 - 40) + 10),
                        surge = this.selectedStudent = lollipop[props - 1],
                        telegram = document.createElement('div');
                    telegram.setAttribute('class', 'telegram');
                    telegram.innerText = Student.toString(surge);
                    unicorn.innerText = Student.toString(surge);
                    telegram.style.cssText = `
                        top: ${propsTop}px;
                        left: ${propsLeft}px;
                        opacity: ${Math.random()};
                        color: ${surge.color};
                        text-shadow: 0 0 5px ${surge.color};
                        font-size: ${propsSize}px;`;
                    $('.decider').append(telegram);
                    // 动画
                    $('.telegram').fadeIn("slow", function () {
                        $(this).fadeOut("slow", function () {
                            $(this).remove();
                        });
                    });
                }, 1000 / 25);
                this.setState({
                    running: true,
                    stopped: false
                }, () => {
                    // 设置是否开启自动连选
                    if (automatic) {
                        const tick = () => {
                            if (this.state.stopped) return;

                            selectLottery(isOver => {
                                if (isOver) {
                                    this.runLottery('stop');
                                }
                                else {
                                    setTimeout(tick, autoInterval);
                                }
                            });
                        };
                        setTimeout(tick, autoInterval);
                    };
                });
            };

            // 还未开始，将数据放入待选择池中
            if (stopped) {
                this.setState({
                    leftList: list,
                    selectedList: [],
                    stopped: true
                }, run);
            }
            else {
                run();
            }
        }

        // 抽奖！
        else {
            selectLottery();
        }
    }


    importExcel() {
        let ipt = document.createElement('input');
        ipt.type = 'file';
        ipt.accept = '.xlsx';
        ipt.onchange = async e => {
            const file = e.target.files[0];

            if (!file) return;
            const filePath = file.path;

            const student = await ExcelParser(filePath);
            this.setState({
                list: student,
                fileName: file.name
            });

            this.storage.set(student);
            ipt = null;
        };

        ipt.click();
    }


    reImport() {
        this.setState({
            list: []
        });
        this.storage.clear();
        this.importExcel();
    }


    openConfigModal() {
        this.setState({ configModal: true }, () => {
            this.props.form.setFieldsValue(this.state.config);
        });
    }


    // 重新设置选项
    resetConfig() {
        const config = this.props.form.getFieldsValue();
        this.setState({
            config,
            configModal: false
        });
    }

    // 取消设置选项
    cancelConfig() {
        this.setState({
            configModal: false
        });
    }

}


export default Form.create()(ExcelLottery);
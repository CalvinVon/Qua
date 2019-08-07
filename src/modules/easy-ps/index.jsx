import React from 'react';
import { Popover, Slider, Input, Tooltip, Icon, Switch } from 'antd';
import ImageEditor from '@toast-ui/react-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import './index.scss';
import LocaleZh from './locale-zh.json';
import RunningHelper from '../../utils/running.helper';

const imageEditorOptions = {
    includeUI: {
        theme: {
            'common.bi.image': null,
            // main icons
            'menu.normalIcon.path': require('tui-image-editor/dist/svg/icon-d.svg'),
            'menu.normalIcon.name': 'icon-d',
            'menu.activeIcon.path': require('tui-image-editor/dist/svg/icon-b.svg'),
            'menu.activeIcon.name': 'icon-b',
            'menu.disabledIcon.path': require('tui-image-editor/dist/svg/icon-a.svg'),
            'menu.disabledIcon.name': 'icon-a',
            'menu.hoverIcon.path': require('tui-image-editor/dist/svg/icon-c.svg'),
            'menu.hoverIcon.name': 'icon-c',
            'menu.iconSize.width': '24px',
            'menu.iconSize.height': '24px',

            // submenu primary color
            'submenu.backgroundColor': '#1e1e1e',
            'submenu.partition.color': '#3c3c3c',

            // submenu icons
            'submenu.normalIcon.path': require('tui-image-editor/dist/svg/icon-d.svg'),
            'submenu.normalIcon.name': 'icon-d',
            'submenu.activeIcon.path': require('tui-image-editor/dist/svg/icon-c.svg'),
            'submenu.activeIcon.name': 'icon-c',
            'submenu.iconSize.width': '32px',
            'submenu.iconSize.height': '32px',
        },
        // menu: ['shape', 'filter'],
        initMenu: 'filter',
        uiSize: {
            width: '100%',
            height: '100%'
        },
        menuBarPosition: 'bottom',
        locale: LocaleZh
    },
    cssMaxHeight: 500,
    cssMaxWidth: 700,
    selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70
    },
    usageStatistics: true
};

export default class EasyPs extends React.Component {
    
    editorRef = React.createRef();
    downloadBtnRef = React.createRef();

    state = {
        quality: 100,
        fileName: '',
        keepAlpha: true,
    }

    componentDidMount() {
        RunningHelper.add(this);
        const button = this.downloadBtnRef.current;
        document.querySelector('.tui-image-editor-header-buttons').appendChild(button);
    }

    render() {
        const content = (
            <div className="download-setting">
                <div className="option option-quality">
                    <div className="option-title">{'图片质量 ' + this.state.quality + '%'}</div>
                    <Slider value={this.state.quality}
                        onChange={quality => this.setState({ quality })} />
                </div>

                <div className="option option-rename">
                    <Input
                        autoFocus
                        value={this.state.fileName}
                        onChange={({ target: { value } }) => this.setState({ fileName: value })}
                        placeholder="重命名生成的文件"
                        suffix={
                            <Tooltip title="不需要输入后缀名">
                                <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                    />
                </div>

                <div className="option option-keep-alpha">
                    <span className="option-title">保持背景透明</span>
                    <Switch checked={this.state.keepAlpha}
                        onChange={keepAlpha => this.setState({ keepAlpha })} />
                </div>
            </div>
        );
        return (
            <div className="easy-ps">
                <ImageEditor
                    ref={this.editorRef}
                    {...imageEditorOptions}
                />

                <Popover content={content}
                    overlayClassName="download-setting-popover"
                    onVisibleChange={this.handleShowPopover.bind(this)}
                    placement="bottomRight">
                    <button className="custom-download-btn"
                        ref={this.downloadBtnRef}
                        onClick={this.handleDownload.bind(this)}>下载</button>
                </Popover>

            </div>
        )
    }

    handleShowPopover(visible) {
        if (!visible) return;

        const instance = this.editorRef.current.imageEditorInst;
        const imageName = instance.getImageName();
        this.setState({
            keepAlpha: /\.png$/.test(imageName)
        });
    }

    handleDownload() {
        const canvas = this.editorRef.current.getRootElement().querySelector('canvas');

        canvas.toBlob(
            blob => {
                console.log(blob)
                const a = document.createElement('a');
                a.download = this.state.fileName;
                a.href = URL.createObjectURL(blob);
                a.click();
            },
            this.state.keepAlpha ? 'image/png' : 'image/jpeg',
            this.state.quality / 100
        );
    }
}
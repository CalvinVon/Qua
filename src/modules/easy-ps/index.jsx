import React from 'react';
import 'tui-image-editor/dist/tui-image-editor.css';
import ImageEditor from '@toast-ui/react-image-editor';
import './index.scss';
import LocaleZh from './locale-zh.json';

const imageEditorOptions = {
    includeUI: {
        theme: {},
        menu: ['shape', 'filter'],
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

    render() {
        return (
            <div className="easy-ps">
                <ImageEditor
                    ref={this.editorRef}
                    {...imageEditorOptions}
                />
            </div>
        )
    }
}
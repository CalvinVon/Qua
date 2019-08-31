import React from 'react';
import RunningHelper from '../../utils/running.helper';

import './index.scss'

export default class Piano extends React.Component {

    iframe = React.createRef();

    state = {
        link: "http://www.autopiano.cn"
    }

    componentDidMount() {
        RunningHelper.add(this);

        const webview = this.refs.webview;
        webview.innerHTML = `<webview src='${this.state.link}' name="piano"></webview>`;
    }


    render() {
        return (
            <div ref="webview" className="piano"></div>
        )
    }

    // render() {
    //     return (
    //         <div className="piano">
    //             <webview src={this.state.link}
    //                 ref={this.iframe}
    //                 title="弹首歌吧"
    //                 name="piano"
    //                 frameBorder="0"
    //                 onLoad={() => this.handleOnFrameload()}></webview>
    //         </div>
    //     )
    // }

    handleOnFrameload() {
        function remove(selector) {
            const dom = document.body.querySelector(selector);
            dom && dom.parentNode.removeChild(dom);
        }

        console.log(this.iframe.current.contentDocument);
        console.log(window.frames.piano.contentDocument);

        remove('a[href="/links"]');
    }
}
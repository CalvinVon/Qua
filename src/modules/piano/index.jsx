import React from 'react';
import RunningHelper from '../../utils/running.helper';

import './index.scss'

export default class Piano extends React.Component {

    state = {
        link: "https://www.autopiano.cn"
    }

    componentDidMount() {
        RunningHelper.add(this);
    }
    
    render() {
        return (
            <div className="piano">
                <iframe src={this.state.link} frameBorder="0"></iframe>
            </div>
        )
    }
}
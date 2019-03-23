import React, { Component } from 'react';
import {isEqual, hashcode} from '../../utils/BaseUtils.js';
import ReactEcharts from 'echarts-for-react';
import reset from './ResetCharts.js';
import './Theme/Theme.js';

export class ReactEchart extends React.Component {
    constructor(props) {
        super(props);
        this.newProps = props;
        this.maxCount = 0;
        this.state = ({
            theme: this.newProps.theme,
            option: this.newProps.option
        });
    }

    static defaultProps = {
        theme: 'dark',
        showCount: 0
    }

    reset() {
        let node = this.echarts_react.echartsElement;
        let option = reset(this.newProps.option, node, this.showCount);
        this.setState({
            theme: this.newProps.theme,
            option: option
        });
    }
    componentDidMount() {
        this.reset();
    }

    componentDidUpdate() {
    }

    componentWillUnmount () {
        if(this.RK) {
            window.clearInterval(this.RK);
        }
    }

    componentWillReceiveProps(nextProps) {
        let d1 = nextProps.option.series.map(function(s) {
            let x = {
                data: s.data,
                type: s.type
            }
            return x;
        });
        let d2 = this.newProps.option.series.map(function(s) {
            let x = {
                data: s.data,
                type: s.type
            }
            return x;
        });
        if(!isEqual(d1, d2)) {
            let echarts_instance = this.echarts_react.getEchartsInstance();
            echarts_instance.clear();
        }
        this.newProps = nextProps;
        this.reset();
    }

    /**
     * 通过配置项option内容创建key
     */
    createKey(option) {
        return hashcode(option);
    }

    render() {
        let key = this.createKey(this.state.option);
        return (
            <ReactEcharts key={key} ref={(e) => { this.echarts_react = e; }}
            option={this.state.option}
            style={{height: '100%', width: '100%'}}
            className='rc-echarts'
            theme={this.state.theme}
             />
        )
    }
}

export default ReactEchart;
import React, { Component } from 'react';
import {isEqual} from '../../utils/BaseUtils.js';
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
    
    fullData() {
        let { option } = this.state;
        // let count = option.series[0].data.length;
        // while(count <= 22) {
            option.series = option.series.map((s, i) => {
                // s.data.push(Math.round(Math.random()*99 + 1));
                s.data.push(null);
                return s;
            });
            // option.xAxis[0].data.push(new Date().format('HH:mm:'+count));
            option.xAxis[0].data.push('');
            // count ++;
        // }
    }

    splitData() {
        let { option } = this.state;
        let node = this.echarts_react.echartsElement;
        let cWidth = node.offsetWidth;
        this.showCount = this.newProps.showCount == -1 ? option.series[0].data.length : (this.newProps.showCount || Math.round(cWidth / 60));
        option.series.map((s, i) => {
            this.maxCount = s.data.length > this.maxCount ? s.data.length : this.maxCount;
        });
    }

    reset() {
        let node = this.echarts_react.echartsElement;
        let option = reset(this.newProps.option, node, this.showCount);
        this.setState({
            option: option
        });
    }

    scroll() {
        let { option } = this.state;
        let series = option.series.map((s, i) => {
            s.data.push(s.data[0]);
            s.data.splice(0, 1);
            return s;
        });
        option.series = series;
        option.xAxis[0].data.push(option.xAxis[0].data[0]);
        option.xAxis[0].data.splice(0, 1);
        let node = this.echarts_react.echartsElement;
        this.reset();
    }

    componentDidMount() {
        let { option } = this.state;
        // if(option.series.length == 1) { // line图超长滚动展示逻辑仅对单chart图生效
        //     if(option.series[0].type == 'line') {
        //         this.splitData();
        //         if(this.maxCount > this.showCount + 1) {
        //             this.fullData();
        //             this.RK = window.setInterval(this.scroll.bind(this), 1000);
        //         }
        //     }
        //     this.reset();
        // }
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

    render() {
        return (
            <ReactEcharts ref={(e) => { this.echarts_react = e; }}
            option={this.state.option}
            style={{height: '100%', width: '100%'}}
            className='rc-echarts'
            theme={this.state.theme}
             />
        )
    }
}

export default ReactEchart;
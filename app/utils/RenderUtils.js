import React from 'react';
import logeImg from '../assets/images/log.png';

function titleRender(state) {
    let time1 = new Date().format('HH:mm:ss');
    let time2 = 60 - new Date().getSeconds();
    return <table className="title-table" cellSpacing="0" cellPadding="0">
            <thead>
            <tr>
                <td className="logo" width="320" rowSpan="2">
                    <img src={logeImg} alt=""/>
                </td>
                <td className="title-center" width="550" rowSpan="2">产线ASS02ZZ电子看板 <br/>Production Line Overview</td>
                <td className="title-field" width="210">
                   标准时间
                </td>
                <td className="title-value" width="210">
                    {time1}
                </td>
            </tr>
            <tr>
                <td className="title-field">
                    转线倒计时
                </td>
                <td className="title-value">{time2}</td>
            </tr>
            </thead>
    </table>
}

function titleRender2(state) {
    let line = state.line;
    let ban = state.ban;
    return <table className="title-table" cellSpacing="0" cellPadding="0">
            <thead>
            <tr>
                <td className="logo" width="320" rowSpan="2">
                    <img src={logeImg} alt=""/>
                </td>
                <td className="title-field" width="210">
                   线次
                </td>
                <td className="title-value" style={{color: 'red'}} width="210">
                    {line}
                </td>
            </tr>
            <tr>
                <td className="title-field">
                    班次
                </td>
                <td className="title-value" style={{color: 'red'}}>{ban}</td>
            </tr>
            </thead>
    </table>
}

function formHeaderRender(state) {
    return <div style={{margin: 0, fontSize: '1.75rem', padding: '20px 0 40px 0'}}>{`班次102投入产出统计`}</div>;
}

function descRender(v, r ,i) {
    return {
        children: v,
        props: {
            style: {color: 'green'}
        }
    }
}
function prj_istimeout_render(r, v, i) {
    let value = v.prj_end - new Date().getTime() < 0 ? '超时' : '正常';
    let color = v.prj_end - new Date().getTime() < 0 ? 'red' : 'green';
    return {
        children: value,
        props: {
            style: {color: color}
        }
    }
}
function ztlbhFetch(th, state, params) {
    let option_ = th.props.option;
    let k = this.params.key;
    let o = eval(k);
    let x = o.data;
    if(x.length < 10) {
        x.push(Math.random().toFixed(2));
    }else {
        x.shift();
        x.push(Math.random().toFixed(2));
    }
    th.setState({
        option: option_
    });
}
function xaixsFetch(th, state, params) {
    let option_ = th.props.option;
    let k = this.params.key;
    let o = eval(k);
    let x = o.data;
    var count = 10;
    if(x.length < count) {
        x.push(x.length);
    }else {
        x.shift();
        x.push(count++);
    }
    th.setState({
        option: option_
    });
}

function tableRender(value, record, index) {
    return {
        children: value,
        props: {
            style: {color: '#0000cd'}
        }
    }
}

function rateRender(value, record, index) {
    let nv = value.replace(/%/, "");
    let style = {};
    if(nv < 100) {
        style = {color: 'red'};
    }else {
        style = {color: '#0000cd'};
    }
    return {
        children: value,
        props: {
            style: style
        }
    }
}

function dateRender(value, record, index) {
    return {
        children: new Date(value).format('yyyy-MM-dd'),
        props: {}
    }
}

let renders = {
    titleRender,
    titleRender2,
    formHeaderRender,
    descRender,
    ztlbhFetch,
    xaixsFetch,
    tableRender,
    rateRender,
    dateRender,
    prj_istimeout_render,
}

module.exports = renders;

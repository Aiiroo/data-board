import React from 'react';
import PropTypes from 'prop-types';
import { isEmptyObject } from '../../utils/BaseUtils.js';
import '../../assets/Form/index.less';

export default class Form extends React.Component {
    static propTypes = {
        fontSize: PropTypes.number,
        state: PropTypes.object,
        fieldCls: PropTypes.string,
        fieldStyle: PropTypes.object,
        valueCls: PropTypes.string,
        valueStyle: PropTypes.object,
        data: PropTypes.array,
        prefixCls: PropTypes.string,
        cls: PropTypes.string,
        style: PropTypes.object,
        header: PropTypes.object,
        columns: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }

    static defaultProps = {
        fontSize: 16,
        state: {},
        fieldCls: '',
        fieldStyle: {},
        valueCls: '',
        valueStyle: {},
        data: [],
        prefixCls: 'rc-form',
        cls: '',
        style: {},
        header: function () { return { text: '', style: {} } },
        columns: 1
    }

    constructor(props) {
        super(props);
        this.state = props;
        let oriState = props.state;
        for (let key in oriState) {
            this.state[key] = oriState[key];
        }
    }

    getHeader() {
        const { fontSize, header, prefixCls, columns } = this.state;
        if (!header) {
            return;
        }
        let helObj = header;
        Object.assign(helObj.style, { fontSize: fontSize });
        if (helObj) {
            const headerEl = <thead className={`${prefixCls}-header`} key="form_header">
                <tr>
                    <td className={`${prefixCls}-header-content`} style={helObj.style} colSpan={'100%'}>{helObj.text}</td>
                </tr>
            </thead>;
            return headerEl;
        }
    }

    getContent() {
        const { fontSize, prefixCls, fieldStyle, valueStyle } = this.state;
        const { columns } = this.state;

        let columnsData = this.getItemColumns();
        const contentEl = <tbody style={{ fontSize: fontSize }} className={`${prefixCls}-content`} key="form_content">
            {
                columnsData.map((tr, i) => {
                    return (
                        <tr className={`${prefixCls}-tr`} key={`content_item_tr_${i}`}>
                            {
                                tr.map((td, i) => {
                                    let c = [];
                                    let colSpan = td.colSpan.replace('%', '');
                                    td.field.width = td.field.width || (100 - (td.value.width || 50));
                                    td.value.width = td.value.width || (100 - td.field.width);
                                    let allWidth = td.field.width + td.value.width;
                                    let colSpan1 = colSpan * td.field.width / allWidth + '%';
                                    let colSpan2 = colSpan * td.value.width / allWidth + '%';
                                    let field = td.render ? ((td.render(td.field.text, td.value.text)) ? td.render(td.field.text, td.value.text).field.text : '') : (typeof td.field === 'object' ? td.field.text : td.field);
                                    let value = td.render ? ((td.render(td.field.text, td.value.text)) ? td.render(td.field.text, td.value.text).value.text : '') : (typeof td.value === 'object' ? td.value.text : td.value);
                                    let currentFieldStyle = td.render ? ((td.render(td.field.text, td.value.text)) ? td.render(td.field.text, td.value.text).field.style : {}) : (typeof td.field === 'object' ? (isEmptyObject(td.field.style) ? fieldStyle : td.field.style) : fieldStyle);
                                    let currentValueStyle = td.render ? ((td.render(td.field.text, td.value.text)) ? td.render(td.field.text, td.value.text).value.style : {}) : (typeof td.value === 'object' ? (isEmptyObject(td.value.style) ? valueStyle : td.value.style) : valueStyle);

                                    return [
                                        <td colSpan={colSpan1} className={`${prefixCls}-item-field`} style={currentFieldStyle} > {field}</td>,
                                        <td colSpan={colSpan2} className={`${prefixCls}-item-value`} style={currentValueStyle} > {value}</td>
                                    ];
                                })
                            }

                        </tr>
                    )
                })
            }
        </tbody>;
        return contentEl;
    }

    getItemColumns() {
        const { data, columns } = this.state;
        let columnsData = [];
        outer:
        for (let i = 0; i < data.length;) {
            let arr = [];
            inner:
            for (let j = 0; j < columns && i < data.length; j++) {
                let fill = data[i].fill || false;
                arr.push(data[i]);
                i++;
                if (fill) {
                    break inner;
                }
            }
            if (arr.length == 0) {
                i++;
            }
            let allWidth = 0;
            arr.map((a) => {
                a.width = a.width || 100 / arr.length;
                allWidth += a.width;
            });
            arr.map((a, x) => {
                a.colSpan = `${100 * a.width / allWidth}%`;
            });
            columnsData.push(arr);
        }
        return columnsData;
    }

    autoSize() {
        const { fontSize } = this.state;
        let node = this.refs.body;
        let thead = node.getElementsByTagName('thead')[0] || { offsetHeight: 0 };
        let tbody = node.getElementsByTagName('tbody')[0];
        let trs = tbody.getElementsByTagName('tr');
        /**
         * 字体大小计算规则：
         * 1.先计算行高：可用高度 / (行数 * (1 + 0.7))
         * 2.再计算字体大小：(行高 * 0.6 + 容器默认字体大小) / 2
         */ 
        let rowHeight = (node.offsetHeight - thead.offsetHeight) / (trs.length * (1 + 0.7));
        for (let i = 0; i < trs.length; i++) {
            let s = ((rowHeight * .6) + fontSize) / 2;
            trs[i].style.fontSize = `${s}px`
        };
    }

    componentDidMount() {
        this.autoSize();
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps, this.autoSize);
    }

    componentDidUpdate(prevProps) {
    }

    componentWillUnmount() {
    }

    render() {
        const props = this.state;
        const prefixCls = props.prefixCls;

        let className = props.prefixCls;
        if (props.cls) {
            className += ` ${props.cls}`;
        }

        const header = this.getHeader();
        const content = this.getContent();

        return (
            <div ref="body" className={className} style={props.style} key='form'>
                <table className={`${prefixCls}-container`} style={props.style} key='form'>
                    {header}
                    {content}
                </table>
            </div>
        );
    }
}

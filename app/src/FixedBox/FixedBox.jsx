import React from 'react';
import PropTypes from 'prop-types';
import renders from '../../utils/RenderUtils.js';
import '../../assets/FixedBox/index.less';

export default class FixedBox extends React.Component {
    static propTypes = {
        render: PropTypes.string,
        state: PropTypes.object,
        prefixCls: PropTypes.string,
        cls: PropTypes.string,
        style: PropTypes.object,
        titleHeight: PropTypes.number,
    }

    static defaultProps = {
        render: '',
        state: {},
        prefixCls: 'rc-fixedbox',
        cls: '',
        titleHeight: 55,
        layout: { x: 0, y: 0, w:0, h:0 }
    }

    constructor(props) {
        super(props);
        this.state = props;
        let oriState = props.state;
        for (let key in oriState) {
            this.state[key] = oriState[key];
        }
    }

    getTop(y) {
        let { titleHeight } = this.props;
        let height = this.getHeight(y);
        return height + titleHeight;
    }

    getLeft(x) {
        let left = this.getWidth(x);
        return left;
    }

    getWidth(w) {
        let screenWidth = window.innerWidth;
        let width = screenWidth * (w / 10);
        return width;
    }

    getHeight(h) {
        let { titleHeight } = this.props;
        let screenHeight = window.innerHeight;
        let contentHeight = screenHeight - titleHeight;
        let height = contentHeight * (h / 10);
        return height;
    }

    getContent() {
        const {config} = this.state;
        let {render, cls, style} = config;
        Object.assign(style, {height: '100%', width: '100%'});

        let tel;
        if (renders[render]) {
          tel = <div className={cls} style={style}>{renders[render]()}</div>;
        }else {
          tel = <div className={cls} style={style}>{render}</div>;
        }
        return tel;
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        this.setState({...nextProps});
    }

    componentDidUpdate(prevProps) {
    }

    componentWillUnmount() {
    }

    render() {
        const defaultStyle = { position: 'absolute', top: 0, left: 0 }
        const {config, prefixCls, cls, layout } = this.state;
        let { x, y, w, h} = layout;

        let style = Object.assign({}, defaultStyle, { top: this.getTop(y) }, { left: this.getLeft(x) }, {width: this.getWidth(w)}, {height: this.getHeight(h)});
        let className = prefixCls;
        if (cls) {
            className += ` ${cls}`;
        }

        let content = this.getContent();

        return (
            <div className={className} style={style} key='fixed'>
                {content}
        </div>
        );
    }
}

import React from 'react';
import { WidthProvider } from 'react-grid-layout';
var ReactGridLayout = WidthProvider(require('react-grid-layout'));
import '../assets/layoutStyle.less';

import Form from '../src/Form/index.js';
import Table from './Table.jsx';
import Charts from '../src/Charts/ECharts.js';


class BasicLayout extends React.Component {

  constructor(props) {
    super(props);
    this.newProps = props;
    var layout = this.generateLayout();
    this.state = {
      children: props,
      layout: layout
    };
  }

  static propTypes = {
    // onLayoutChange: PropTypes.func.require,
  }

  static defaultProps = {
    className: "layout",
    items: [],
    onLayoutChange: (l) => { },
    cols: 10, // 屏幕横宽最大值
    rowHeight: 50,
    margin: [0, 0], // 元素间隔
    verticalCompact: false, // 垂直方向贴靠
    useCSSTransforms: false, // 使用动画
    autoSize: true //自适应
  }

  // 创建div元素
  generateDOM() {
    const { items, theme, themeConfig } = this.newProps;

    return items.map(function (item, i) {
      let { type, config } = item;
      if (type == 'form') {
        return (<div key={i}><Form theme={theme} themeConfig={themeConfig.form} {...config} /></div>);
      } else if (type == 'table') {
        return (<div key={i}><Table theme={theme} themeConfig={themeConfig.table} {...config} /></div>);
      } else if (type == 'charts') {
        return <div key={i}><Charts theme={theme} themeConfig={themeConfig.charts} {...config} /></div>
      } else {
        return (<div key={i}><span className="text">{i}</span></div>);
      }
    });
  }

  // 设置每个div的属性
  generateLayout() {
    const { items } = this.newProps;
    return items.map(function (item, i) {
      let { layout } = item;
      let { x, y, w, h } = layout;
      return { x: x, y: y, w: w, h: h, i: i.toString(), isDraggable: false, isResizable: false };
    });
  }

  onLayoutChange(layout) {
    this.newProps.onLayoutChange(layout);
  }

  componentDidUpdate() {
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    this.newProps = nextProps;
    let layout = this.generateLayout();

    this.setState({
      children: nextProps,
      layout: layout
    });
  }

  render() {
    return (
      <ReactGridLayout layout={this.state.layout} onLayoutChange={this.onLayoutChange(this.state.layout)}
        {...this.state.children}>
        {this.generateDOM()}
      </ReactGridLayout>
    );
  }

};

module.exports = BasicLayout;


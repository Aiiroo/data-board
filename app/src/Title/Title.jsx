import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/Title/index.less';

export default class Title extends React.Component {
  static propTypes = {
    static: PropTypes.object,
    prefixCls: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static defaultProps = {
    prefixCls: 'rc-title',
    title: '',
    fontSize: 20
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    this.setTitleHeight();
  }
  
  componentWillReceiveProps(nextProps) {
  }
  
  componentDidUpdate(prevProps) {
    if(this.props.title == prevProps.title) {
      return;
    }
    this.setTitleHeight();
  }

  getTitle() {
    const { title } = this.props;
    return title;
  }

  getTitleHeight() {
    return this.refs.title.offsetHeight;
  }

  setTitleHeight() {
      let height = this.getTitleHeight();
      this.props.setTitleHeight(height);
  }

  render() {
    const props = this.props;
    const {prefixCls, fontSize} = props;

    let className = prefixCls;

    let title = this.getTitle();
    return (
      <div ref='title' className={className} style={{fontSize: fontSize}} key={prefixCls} dangerouslySetInnerHTML={{ __html: title }}>
      </div>
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/MessageBox/msgbox.less';

export default class MessageBox extends React.Component {
    static propTypes = {
        static: PropTypes.object,
        prefixCls: PropTypes.string,
        error: PropTypes.object
    }

    static defaultProps = {
        static: {},
        prefixCls: 'rc-msgbox',
        error: {}
    }

    constructor(props) {
        super(props);
        this.state = props;
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
        const { msg, prefixCls} = this.state;
        let { name, message } = msg;
        return (
            <div className={prefixCls} key='msgbox'>
               <div className={`${prefixCls}-title`}>{name}</div>
               <div className={`${prefixCls}-content`}>{`${message}`}</div>
            </div>
        );
    }
}

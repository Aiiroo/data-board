import React from 'react';
import Container from './Layout.js';
import Title from '../src/Title/Title.jsx';
import MessageBox from '../src/MsgBox/MessageBox.jsx';
import { converter } from './converter.js';
import URL from '../constants/url.dev.json';
import 'whatwg-fetch';
import { getThemeConfig, applyTheme } from './theme/applyTheme.js';

import tempdata from '../data/组合看板1.json';

class Factory extends React.Component {

    constructor(props) {
        super(props);
        this.dev = 'local';
        
        this.index = 0;
        this.state = {
            theme: 'dark',
            themeConfig: {},
            titleHeight: 0,
            error: null,
            firstRequestTime: new Date()
        };
    }

    getModelConfig(url) {
        let me = this;
        fetch(url, {
            method: 'POST',
            credentials: 'include'
        }).then(function (response) {
            return (response.json())
        }).then((json) => {
            let theme = json.theme || 'dark';
            let themeConfig = json.themeConfig || {};
            me.setState({
                theme: theme,
                themeConfig: getThemeConfig(theme, themeConfig),
            });
            return json;
        }).then((json) => {
            if(!json.instance) {
                throw {message: json.message};
            }
            let instance = json.instance;
            if (!me.state.instance) {
                me.setState({
                    instance: instance
                }, me.setRefresh);
            }
            return json;
        }).then(function (json) {
            let modelconfig = json.data[0];
            let theme = json.theme;

            if(!modelconfig.content) {
                throw {message: '该看板内容为空'}
            }
            me.setState({
                msg: null,
                model: converter(modelconfig, theme),
            });
        }).then(() => {
            applyTheme(me.state.theme);
            me.setState({
                titleHeight: me.getTitleHeight(),
            });
        }).catch(function (ex) {
            let message = ex.message;
            if(ex.name && ex.name == 'TypeError') {
                message = '网络连接异常';
            }
            me.setState({
                msg: {name: 'Error', message: message}
            });
            console.log('parsing failed', ex);
        });
    }

    getTitleHeight() {
        let titleEl = document.getElementsByClassName('rc-title');
        let titleHeight = titleEl.length > 0 ? titleEl[0].offsetHeight : 0;
        titleHeight = titleHeight || 0;
        return titleHeight;
    }

    setTitleHeight(height) {
        this.setState({
            titleHeight: height
        });
    }

    setRefresh() {
        let { instance } = this.state;
        if (!instance) { return; }
        let codes = instance.enabledKanbanCodes;
        let display = instance.display;
        let next = {
            enable: instance.switchFrequency > 0 ? true : false,
            interval: instance.switchFrequency
        };
        let current = {
            enable: instance.refreshFrequency > 0 ? true : false,
            interval: instance.refreshFrequency
        };
        let refresh = {
            current: current,
            next: next
        };
        if (refresh.current) {
            if (refresh.current.enable) {
                this.refreshThis = setInterval(function () {
                    if (this.index == codes.length - 1) {
                        this.index = 0;
                    } else {
                        this.index++;
                    }
                    let reg = /(.*){code}(.*){index}(.*){kanbanCode}(.*)/g;
                    this.getModelConfig(URL.completelyPath.replace(reg, '$1' + this.props.code + '$2' + this.props.index + '$3' + codes[this.index]));
                }.bind(this), refresh.current.interval * 1000 || 10000)
            }
        }
    }

    onWindowResize() {
        this.setTitleHeight(this.getTitleHeight());
    }

    componentDidUpdate() {
    }

    componentWillMount() {
        let { code, index } = this.props;
        if(this.dev == 'local') {
            this.setState({
                theme: tempdata.theme || 'dark',
                themeConfig: getThemeConfig(tempdata.theme, tempdata.themeConfig),
                model: converter(tempdata.data[0], tempdata.theme || 'dark'),
            });
            this.refreshNext = setInterval(function () {
                if (this.index >= tempdata.data.length-1) {
                    this.index = 0;
                } else {
                    this.index++;
                }
                this.setState({
                    model: converter(tempdata.data[this.index],  tempdata.theme || 'dark'),
                });
            }.bind(this), 700000)
        }else {
            let reg = /(.*){code}(.*){index}(.*)/g;
            this.getModelConfig(URL.defaultPath.replace(reg, '$1' + code + '$2' + index));
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        applyTheme(this.state.theme);
        this.setState({
            titleHeight: this.getTitleHeight(),
        });
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
        if (this.refreshThis) {
            if (this.refreshThis.interval > 0) {
                window.clearInterval(this.refreshThis);
            }
        }
        if (this.refreshNext) {
            if (this.refreshNext.interval > 0) {
                window.clearInterval(this.refreshNext);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        let { theme, themeConfig, titleHeight, model, msg } = this.state;
        if (msg) {
            return <MessageBox static={this.props.static} titleHeight={titleHeight} msg={msg} />
        }
        if (!this.state.model) {
            return <div style={{color: 'white'}}>loading...</div>
        }
        
        const { title, content, fixedbox } = model;
        let titleConfig = title;
        let items = [];
        if (fixedbox) {
            items = fixedbox.items || [];
        }

        let itemMargin = themeConfig.items ? (themeConfig.items.margin || [0, 0]) : [0, 0];
        let containerHeight = window.innerHeight - titleHeight - (10 * itemMargin[1] + itemMargin[1]);
        let rowHeight = containerHeight / 10;
        return (
            <div ref='body' className={theme}>
                <Title setTitleHeight={this.setTitleHeight.bind(this)} {...titleConfig} />
                <Container theme={theme} themeConfig={themeConfig} items={content.items} rowHeight={rowHeight} margin={itemMargin}/>
            </div>
        );
    }

};

module.exports = Factory;

function converter(data, theme) {
    let { content } = data;
    let { title, items } = content;
    let itemsarr = items ? (items instanceof Array ? items : [items]) : [];

    let me = this;
    let newItems = itemsarr.map(function (v, i) {
        let type = v.type;
        if (type == 'form') {
            return formConfig(v, theme);
        } else if (type == 'table') {
            return tableConfig(v, theme);
        } else if (type == 'bar') {
            return barConfig(v, theme);
        } else if (type == 'line') {
            return lineConfig(v, theme);
        } else if (type == 'pie') {
            return pieConfig(v, theme);
        } else if(type == 'mixchart') {
            return mixChartConfig(v, theme);
        } else {

        }
    });
    return {
        title: titleConfig(title),
        content: {
            items: newItems
        }
    }
}

function titleConfig(title) {
    return {
        title: replaceSpecTag(title),
        fontSize: getFontSize()
    }
}

function formConfig(model, theme) {
    let { type, config, layout } = model;
    let { fontSize, header, fieldStyle, valueStyle, columns, data } = config;
    data = data ? ( ( data instanceof Array ) ? data : [data] ) : [];
    data = data.map((d) => {
        d.field = {
            text: d.field.text,
            style: parseObjectStr(d.field.style),
            width: d.field.width
        };
        d.value = {
            text: d.value.text,
            style: parseObjectStr(d.value.style),
            width: d.value.width
        };
        d.render = renderFunction(d.render);
        return d;
    });
    if(header) {
        header.style = parseObjectStr(header.style || '{}');
    }
    let c = {
        type: 'form',
        config: {
            fontSize: fontSize || getFontSize(),
            header: header,
            fieldStyle: parseObjectStr(fieldStyle),
            valueStyle: parseObjectStr(valueStyle),
            columns,
            data
        },
        layout: getLayout(layout)
    }
    return c;
}

function tableConfig(model, theme) {
    let { type, config, layout } = model;
    let { fontSize, title, cls, render, columns, data, pagesize, interval, headerrowsstyle, rowsstyle } = config;
    let allWidth = 0;
    columns = columns ? ( ( columns instanceof Array ) ? columns : [columns] ) : [];
    columns.map((c, i) => allWidth += (c.width || 100));
    data = data ? ( ( data instanceof Array ) ? data : [data] ) : [];
    if(title) {
        title.style = parseObjectStr(title.style || '{}');
    }
    return {
        type: 'table',
        config: {
            fontSize: fontSize || getFontSize(),
            pageSize: pagesize,
            refreshInterval: interval,
            title: title,
            render: renderFunction(render),
            columns: columns.map( (v, i) => {
                v.key = i;
                v.width ? v.width = (getScreenSize().width * (layout.w/100) - 50) * (v.width/ allWidth) : '';
                v.render = renderFunction(v.render);
                v.headerRowStyle = parseObjectStr(v.headerrowstyle);
                v.rowStyle = parseObjectStr(v.rowstyle);
                return v;
            }),
            data: data.map( (v, i) => {
                if(v){
                    v.key = i;
                }
                return v || {};
            } ),
            headerRowsStyle: parseObjectStr(headerrowsstyle),
            rowsStyle: parseObjectStr(rowsstyle),
        },
        layout: getLayout(layout)
    }
}

function barConfig(model, theme) {
    let { type, config, layout } = model;
    let { fontSize, title, subtitle, xtitle, xtype, xfields, xconfig, ytitle, ytype, yfields, series, yconfig,
        legendconfig, areaconfig, barconfig, color } = config;

    xconfig = parseObjectStr(xconfig);
    yconfig = parseObjectStr(yconfig);
    legendconfig = parseObjectStr(legendconfig);
    areaconfig = parseObjectStr(areaconfig);
    barconfig = parseObjectStr(barconfig);
    
    color = eval(color);
    series = series ? ((series instanceof Array) ? series : [series]) : [];
    let xf = (xfields instanceof Array) ? xfields : (xfields.replace(['['], '').replace([']'], '').split(',')),
        areaLeft = Number(areaconfig.left)>=0 ? areaconfig.left+'%' : '5%',
        areaRight = Number(areaconfig.right)>=0 ? areaconfig.right+'%' : '5%',
        areaTop = Number(areaconfig.top)>=0 ? areaconfig.top+'%' : (layout.h * getScreenSize().height / 100 < 310 ? '35%' : '28%'),
        areaBottom = Number(areaconfig.bottom)>=0 ? areaconfig.bottom+'%' : (layout.h * getScreenSize().height / 100 < 310 ? '20%' : '16%');
    
    let colors = getColors(color, theme);
    let themeColor = getThemeColor(theme);

    let o = {
        type: 'charts',
        config: {
            option: {
                color: colors,
                title: getChartsTitle(fontSize, layout, title, subtitle),
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    containLabel: true,
                    left: areaLeft,
                    right: areaRight,
                    top: areaTop,
                    bottom: areaBottom
                },
                legend: getBarLegend(fontSize, layout, series, legendconfig),
                xAxis: [{
                    type: xtype,
                    data: xf,
                    name: xtitle,
                    position: xconfig.position || 'bottom',
                    nameGap: xconfig.nameGap || 5,
                    nameRotate: xconfig.nameRotate || 0,
                    nameLocation: xconfig.nameLocation || 'end',
                    nameTextStyle: {
                        fontSize: getFontSize() * .7
                    },
                    axisLabel: {
                        rotate: Number(xconfig.labelRotate)>=0 ? Number(xconfig.labelRotate) : (getScreenSize().width * layout.w / xf.length / 100 < 80 ? 45 : 0),
                        interval: 0,
                        textStyle: {
                            fontSize: getFontSize() * .7
                        }
                    }
                }],
                yAxis: [{
                    name: ytitle,
                    nameRotate: yconfig.nameRotate || 0,
                    position: yconfig.position || 'left',
                    nameLocation: yconfig.nameLocation || 'end',
                    nameGap: yconfig.nameGap || 15,
                    type: ytype == 'numeric' ? 'value' : ytype,
                    nameTextStyle: {
                        fontSize: getFontSize() * .7
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: getFontSize() * .7
                        }
                    },
                    max: yconfig.max || null,
                    min: yconfig.min || null
                }],
                series: getBarSeries(fontSize, layout, series, barconfig)
            }
        },
        layout: getLayout(layout)
    }
    
    return o;
}

function lineConfig(model, theme) {
    let { type, config, layout } = model;
    let { fontSize, title, subtitle, xtitle, xtype, xfields, xconfig, ytitle, ytype, yfields, yconfig,
        series, legendconfig, areaconfig, lineconfig, color } = config;
    
    xconfig = parseObjectStr(xconfig);
    yconfig = parseObjectStr(yconfig);
    legendconfig = parseObjectStr(legendconfig);
    areaconfig = parseObjectStr(areaconfig);
    lineconfig = parseObjectStr(lineconfig);
    color = eval(color);
    series = series ? ((series instanceof Array) ? series : [series]) : [];
    let xf = (xfields instanceof Array) ? xfields : (xfields.replace(['['], '').replace([']'], '').split(',')),
        areaLeft = Number(areaconfig.left)>=0 ? areaconfig.left+'%' : '5%',
        areaRight = Number(areaconfig.right)>=0 ? areaconfig.right+'%' : '5%',
        areaTop = Number(areaconfig.top)>=0 ? areaconfig.top+'%' : (layout.h * getScreenSize().height / 100 < 310 ? '35%' : '28%'),
        areaBottom = Number(areaconfig.bottom)>=0 ? areaconfig.bottom+'%' : (layout.h * getScreenSize().height / 100 < 310 ? '20%' : '16%');
    
    let colors = getColors(color, theme);
    let themeColor = getThemeColor(theme);

    let o = {
        type: 'charts',
        config: {
            option: {
                color: colors,
                title: getChartsTitle(fontSize, layout, title, subtitle),
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    containLabel: true,
                    left: areaLeft,
                    right: areaRight,
                    top: areaTop,
                    bottom: areaBottom
                },
                legend: getLineLegend(fontSize, layout, series, legendconfig),
                xAxis: [{
                    type: xtype,
                    data: xf,
                    name: xtitle,
                    position: xconfig.position || 'bottom',
                    nameRotate: xconfig.nameRotate || 0,
                    nameLocation: xconfig.nameLocation || 'end',
                    nameGap: xconfig.nameGap || 15,
                    nameTextStyle: {
                        fontSize: fontSize || getFontSize() * .7
                    },
                    axisLabel: {
                        rotate: Number(xconfig.labelRotate)>=0 ? Number(xconfig.labelRotate) : (getScreenSize().width * layout.w / xf.length / 100 < 80 ? 45 : 0),
                        interval: 0,
                        textStyle: {
                            fontSize: fontSize || getFontSize() * .7
                        }
                    }
                }],
                yAxis: [{
                    name: ytitle,
                    nameRotate: yconfig.nameRotate || 0,
                    position: yconfig.position || 'left',
                    nameLocation: yconfig.nameLocation || 'end',
                    nameGap: yconfig.nameGap || 15,
                    type: ytype == 'numeric' ? 'value' : ytype,
                    nameTextStyle: {
                        fontSize: fontSize || getFontSize() * .7
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: fontSize || getFontSize() * .7
                        }
                    },
                    max: yconfig.max || null,
                    min: yconfig.min || null
                }],
                series: getLineSeries(fontSize, series, lineconfig, colors, themeColor),
                dataZoom: series.length > 0 ? [
                    {
                        type: 'slider',
                        show: false,
                        xAxisIndex: [0],
                        start: 0,
                        endValue: Math.round(getScreenSize().width * layout.w / 100 / 60) >= series[0].data.length ? series[0].data.length - 1 : Math.round(getScreenSize().width * layout.w / 100 / 60),
                    }
                ] : null,
            }
        },
        layout: getLayout(layout)
    }
    
    return o;
}

function mixChartConfig(model, theme) {
    let { type, config, layout } = model;
    let { fontSize, title, subtitle, xtitle, xtype, xfields, xconfig, ybar, yline, series, legendconfig,
        areaconfig, barconfig, lineconfig, barcolor, linecolor } = config;

    xconfig = parseObjectStr(xconfig);
    ybar = parseObjectStr(ybar);
    ybar.config = parseObjectStr(ybar.config);
    yline = parseObjectStr(yline);
    yline.config = parseObjectStr(yline.config);
    
    legendconfig = parseObjectStr(legendconfig);
    areaconfig = parseObjectStr(areaconfig);
    barconfig = parseObjectStr(barconfig);
    lineconfig = parseObjectStr(lineconfig);
    barcolor = eval(barcolor);
    linecolor = eval(linecolor);
    series = series ? ((series instanceof Array) ? series : [series]) : [];

    let xf = (xfields instanceof Array) ? xfields : (xfields.replace(['['], '').replace([']'], '').split(',')),
        areaLeft = Number(areaconfig.left)>=0 ? areaconfig.left+'%' : '5%',
        areaRight = Number(areaconfig.right)>=0 ? areaconfig.right+'%' : '5%',
        areaTop = Number(areaconfig.top)>=0 ? areaconfig.top+'%' : (layout.h * getScreenSize().height / 100 < 310 ? '35%' : '28%'),
        areaBottom = Number(areaconfig.bottom)>=0 ? areaconfig.bottom+'%' : (layout.h * getScreenSize().height / 100 < 310 ? '20%' : '16%');
        
    let barcolors = getColors(barcolor, theme);
    let linecolors = getColors(linecolor, theme);
    
    var o = {
        type: 'charts',
        config: {
            option: {
                title: getChartsTitle(fontSize, layout, title, subtitle),
                tooltip: {
                    trigger: 'axis'
                },
                legend: getMixChartLegend(),
                grid: {
                    containLabel: true,
                    top: areaTop,
                    bottom: areaBottom,
                    left: areaLeft,
                    right: areaRight
                },
                xAxis: [{
                    type: xtype,
                    data: xf,
                    name: xtitle,
                    position: xconfig.position || 'bottom',
                    nameGap: xconfig.nameGap || 15,
                    nameRotate: xconfig.nameRotate || 0,
                    nameLocation: xconfig.nameLocation || 'end',
                    nameTextStyle: {
                        fontSize: getFontSize() * .7
                    },
                    axisLabel: {
                        rotate: Number(xconfig.labelRotate)>=0 ? xconfig.labelRotate : (getScreenSize().width * layout.w / xf.length / 100 < 80 ? 45 : 0),
                        interval: 0,
                        textStyle: {
                            fontSize: getFontSize() * .7
                        }
                    }
                }],
                yAxis: [{
                    name: ybar.title,
                    position: ybar.config ? (ybar.config.position || 'left') : 'left',
                    nameRotate: ybar.config ? (ybar.config.nameRotate || 0) : 0,
                    nameLocation: ybar.config ? (ybar.config.nameLocation || 'end') : 'end',
                    nameGap: ybar.config ? (ybar.config.nameGap || 15) : 15,
                    type: ybar.type == 'numeric' ? 'value' : ytype,
                    nameTextStyle: {
                        fontSize: getFontSize() * .7
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: getFontSize() * .7
                        }
                    }
                },{
                    name: yline.title,
                    position: yline.config ? (yline.config.position || 'right') : 'right',
                    nameRotate: yline.config ? (yline.config.nameRotate || 0) : 0,
                    nameLocation: yline.config ? (yline.config.nameLocation || 'end') : 'end',
                    nameGap: yline.config ? (yline.config.nameGap || 15) : 15,
                    type: yline.type == 'numeric' ? 'value' : ytype,
                    nameTextStyle: {
                        fontSize: getFontSize() * .7
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: getFontSize() * .7
                        }
                    }
                }],
                series: getMixChartSeries(fontSize, layout, series, barconfig, lineconfig, barcolors, linecolors)
            }
        },
        layout: getLayout(layout)
    };

    return o;
}

function pieConfig(model, theme) {
    let { type, config, layout } = model;
    let { fontSize, title, subtitle, series, color, legendconfig, pieconfig } = config;
    color = eval(color);
    legendconfig = parseObjectStr(legendconfig);
    pieconfig = parseObjectStr(pieconfig);
    series = series ? ((series instanceof Array) ? series : [series]) : [];
    series = series.map((v, i) => {
        v.name += '';
        let textWidth = getTextViewWidth(v.name, fontSize || getFontSize() * 0.7);
        v.name = v.name.replace(/\n/g,'');
        if(legendconfig.orient == 'vertical' && legendconfig.width) {
            legendconfig.itemWidth = legendconfig.itemWidth ? Number(legendconfig.itemWidth) : 25;
            legendconfig.itemGap = legendconfig.itemGap ? Number(legendconfig.itemGap) : layout.w / 10;
            let availableWidth = Number(legendconfig.width) - legendconfig.itemWidth - legendconfig.itemGap;
            if(availableWidth >0 && textWidth > availableWidth) {
                fontSize = fontSize || getFontSize() * 0.7;
                v.name = wrapText(v.name, fontSize, availableWidth)
             }
        }
        v.value = v.data;
        return v;
    });
    
    let colors = getColors(color, theme);
    let themeColor = getThemeColor(theme);

    let o = {
        type: 'charts',
        config: {
            option: {
                color: colors,
                title: getChartsTitle(fontSize, layout, title, subtitle),
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c} ({d}%)'
                },
                legend: getPieLegend(fontSize, layout, series, legendconfig),
                series: getPieSeries(fontSize, layout, series, pieconfig),
                animation: !pieconfig.centerx && !pieconfig.centery
            }
        },
        layout: getLayout(layout)
    }
    return o;
}

function renderFunction(funcStr) {
    let func = undefined;
    func = (new Function("return " + funcStr))();
    return func;
}

function getChartsTitle(fontSize, layout, title, subtitle) {
    var title = {
        show: true,
        text: title,
        subtext: layout.h * getScreenSize().height / 100 < 300 ? '' : subtitle,
        textAlign: 'center',
        textStyle: {
            verticalAlign: 'top',
            fontSize: fontSize || getFontSize() * 1
        },
        subtextStyle: {
            verticalAlign: 'top',
            fontSize: fontSize || getFontSize() * 0.75
        },
        left: '50%',
        right: '50%',
        itemGap: 5,
        padding: 10
    }
    return title;
}

function getBarSeries(fontSize, layout, series, barconfig) {
    let s = [];
    const model = {
        type: 'bar',
        label: {
            normal: {
                show: !barconfig.hideLabel,
                position: barconfig.labelPosition || 'top',
                distance: barconfig.labelDistance ? Number(barconfig.labelDistance) : 5,
                formatter: barconfig.labelFormatter || '{c}',
                textStyle: {
                    fontSize: fontSize || getFontSize() * .7
                }
            }
        },
        barGap: '10%',
        barMaxWidth: barconfig.barMaxWidth || undefined,
        barWidth: barconfig.barWidth || undefined,
        barMinHeight: barconfig.barMinHeight || undefined,
        barGap: barconfig.barGap || undefined
    }
    s = series.map((v, i) => {
        let m = Object.assign({}, model);
        m.name = v.name;
        m.data = v.data instanceof Array ? v.data : [v.data];
        return m;
    });
    
    return s;
}

function getBarLegend(fontSize, layout, series, legendconfig) {
    let legendLeft = Number(legendconfig.left)>=0 ? legendconfig.left+'%' : null,
    legendTop = Number(legendconfig.top)>=0 ? legendconfig.top+'%' : (layout.h * getScreenSize().height / 100 < 310 ? '20%' : '18%'),
    itemGap = Number(legendconfig.itemGap)>=0 ? Number(legendconfig.itemGap) : layout.w / 10,
    itemWidth = Number(legendconfig.itemWidth)>=0 ? Number(legendconfig.itemWidth) : 25,
    itemHeight = Number(legendconfig.itemHeight)>=0 ? Number(legendconfig.itemHeight) : 14;

    let legend = {
        show: !legendconfig.hide,
        top: legendTop,
        padding: 0,
        orient: legendconfig.orient || 'horizontal',
        itemGap: itemGap,
        itemWidth: itemWidth,
        itemHeight: itemHeight,
        textStyle: {
            fontSize: getFontSize() * 0.7
        },
        data: series.map((v, i) => {
            return v.name
        })
    };

    legendLeft ? (legend.left = legendLeft) : (legend.right = '5%');

    return legend;
}

function getLineSeries(fontSize, series, lineconfig, colors, themeColor) {
    let s = [],
    areaStyleCfg = lineconfig.areaStyle || '[]';

    areaStyleCfg = JSON.parse(areaStyleCfg);

    const model = {
        type: 'line',
        smooth: lineconfig.smooth || false,
        lineStyle: {
            normal: {
                width: lineconfig.lineWidth || 2,
                type: lineconfig.lineType || 'solid'
            }
        },
        markLine: {
            symbol: '',
            label: {
                normal: {
                    show: false
                }
            },
            data: [{
                name: '起始位置',
                yAxis: null,
                xAxis: ''
            }]
        },
        symbol: lineconfig.symbol || 'circle',
        symbolSize: lineconfig.symbolSize || 4,
        showSymbol: !lineconfig.hideSymbol,
        label: {
            normal: {
                show: !lineconfig.hideLabel,
                position: lineconfig.labelPosition || 'top',
                distance: lineconfig.labelDistance ? Number(lineconfig.labelDistance) : 5,
                formatter: lineconfig.labelFormatter || '{c}',
                textStyle: {
                    fontSize: fontSize || getFontSize() * .7
                },
                color: 'auto'
            }
        }
    }
    // 对数据相近而重叠的标注进行位置偏移
    // 各个series的偏移量
    let offset = series.map((v, i) => {
        let labelOffsetX = eval('[' + lineconfig.labelOffsetX + ']');
        let labelOffsetY = eval('[' + lineconfig.labelOffsetY + ']');
        return [labelOffsetX[i] || 0, labelOffsetY[i] || 0];
    });
    s = series.map((v, i) => {
        /*let m = Object.assign({}, model);
        使用时需要注意，该方法是浅拷贝
        */
        let m = JSON.parse(JSON.stringify(model));
        m.name = v.name;
        m.data = v.data instanceof Array ? v.data : [v.data];
        m.label.normal.offset = offset[i];

        let areaStyle = areaStyleCfg[i];
        if(areaStyle && areaStyle.enable && areaStyle.enable == 'true') {
            let gradient = areaStyle.gradient || 'null'; // 渐变
            let color = areaStyle.color || colors[i]; // 颜色
            let opacity = areaStyle.opacity || 1;
            let cfg = null;

            if(gradient == 'null') {
                cfg = {
                    normal: {
                        opacity: opacity,
                        color: color
                    }
                }
            }else if(gradient == 'horizontal') {
                cfg = {
                    normal: {
                        opacity: opacity,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 1,
                            x2: 1,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: color // 0% 处的颜色
                            }, {
                                offset: 1, color: themeColor // 100% 处的颜色
                            }],
                            globalCoord: true // 缺省为 false
                        }
                    }
                }
            }else if(gradient == 'vertical') {
                cfg = {
                    normal: {
                        opacity: opacity,
                        color: {
                            type: 'linear',
                            x: 1,
                            y: 0,
                            x2: 1,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: color // 0% 处的颜色
                            }, {
                                offset: 1, color: themeColor // 100% 处的颜色
                            }],
                            globalCoord: true // 缺省为 false
                        }
                    }
                }
            }
            m.areaStyle = cfg;
        }
        return m;
    });
    return s;
}

function getLineLegend(fontSize, layout, series, legendconfig) {
    let legendLeft = Number(legendconfig.left)>=0 ? legendconfig.left+'%' : null,
    legendTop = Number(legendconfig.top)>=0 ? legendconfig.top+'%' : (layout.h * getScreenSize().height / 100 < 310 ? '20%' : '18%'),
    itemGap = Number(legendconfig.itemGap)>=0 ? Number(legendconfig.itemGap) : layout.w / 10,
    itemWidth = Number(legendconfig.itemWidth)>=0 ? Number(legendconfig.itemWidth) : 25,
    itemHeight = Number(legendconfig.itemHeight)>=0 ? Number(legendconfig.itemHeight) : 14;

    let legend = {
        show: !legendconfig.hide,
        top: legendTop,
        padding: 0,
        orient: legendconfig.orient || 'horizontal',
        itemGap: itemGap,
        itemWidth: itemWidth,
        itemHeight: itemHeight,
        textStyle: {
            fontSize: fontSize || getFontSize() * 0.7
        },
        data: series.map((v, i) => {
            return v.name
        })
    }

    legendLeft ? (legend.left = legendLeft) : (legend.right = '5%');

    return legend;
}

function getPieSeries(fontSize, layout, series, pieconfig) {
    let data = series.length > 0 ? series : [{name: '无数据', value: 0}];

    
    const model = {
        type: 'pie',
        centerx: pieconfig.centerx,
        centery: pieconfig.centery,
        radius1: pieconfig.radius1,
        radius2: pieconfig.radius2,
        label: {
            normal: {
                show: !pieconfig.hideLabel,
                textStyle: {
                    fontSize: fontSize || getFontSize() * 0.7
                },
                formatter: pieconfig.labelFormatter || '{b}:  {c} \n {d}%'
            }
        }
    }
    let s = Object.assign({}, model);
    s.name = '';
    s.data = data.map((d, i) => { d.name = d.name || 'Unkonw'; return d; });
    if(series.length == 0) {
        s.itemStyle = {
            normal: {
                color: '#b0a494',
            }
        };
        s.label = {
            normal: {
                show: false
            }
        }
        s.labelLine = {
            normal: {
                show: false
            }
        }
        s.silent = true;
    }
    return [s];
}

function getPieLegend(fontSize, layout, series, legendconfig) {
    let hide = legendconfig.hide === 'true' || legendconfig.hide === true,
        top = legendconfig.top ? (legendconfig.top)+'%' : null,
        left = legendconfig.left ? legendconfig.left+'%' : null,
        itemGap = legendconfig.itemGap ? Number(legendconfig.itemGap) : layout.w / 10,
        itemWidth = legendconfig.itemWidth ? Number(legendconfig.itemWidth) : 25,
        itemHeight = legendconfig.itemHeight ? Number(legendconfig.itemHeight) : 14,
        formatter = legendconfig.formatter || '{name}';

    let dataMap = {};
    series.map(function(s) {
        dataMap[s.name] = s.value;
    });

    let legend = {
        show: !hide,
        top_: top,
        left_: left,
        width: legendconfig.width,
        height: legendconfig.height,
        orient_: legendconfig.orient,
        itemGap: itemGap,
        itemWidth: itemWidth,
        itemHeight : itemHeight,
        padding: 0,
        textStyle: {
            fontSize: fontSize || getFontSize() * 0.7
        },
        data: series.map((v, i) => {
            return v.name || 'Unkonw';
        }),
        formatter: function(name) {
            let value = dataMap[name],
            label = '';

            label = formatter.replace('{name}', name).replace('{value}', value);
            return label;
        }
    }
    if(series.length == 0) {
        legend.data = ['无数据']
    }
    return legend;
}

function getMixChartSeries(fontSize, layout, series, barconfig, lineconfig, barcolors, linecolors) {
    let s = [];
    const barmodel = {
        type: 'bar',
        label: {
            normal: {
                show: !barconfig.hideLabel,
                position: barconfig.labelPosition || 'top',
                distance: barconfig.labelDistance ? Number(barconfig.labelDistance) : 5,
                formatter: barconfig.labelFormatter || '{c}',
                textStyle: {
                    fontSize: fontSize || getFontSize() * .7
                }
            }
        },
        barGap: '10%',
        barMaxWidth: barconfig.barMaxWidth || undefined,
        barWidth: barconfig.barWidth || undefined,
        barMinHeight: barconfig.barMinHeight || undefined,
        barGap: barconfig.barGap || undefined
    }
    const linemodel = {
        type: 'line',
        yAxisIndex: 1,
        smooth: lineconfig.smooth || false,
        lineStyle: {
            normal: {
                width: lineconfig.lineWidth || 2,
                type: lineconfig.lineType || 'solid'
            }
        },
        markLine: {
            symbol: '',
            label: {
                normal: {
                    show: false
                }
            },
            data: [{
                name: '起始位置',
                yAxis: null,
                xAxis: ''
            }]
        },
        symbol: lineconfig.symbol || 'circle',
        symbolSize: lineconfig.symbolSize || 4,
        showSymbol: !lineconfig.hideSymbol,
        label: {
            normal: {
                show: !lineconfig.hideLabel,
                position: lineconfig.labelPosition || 'top',
                distance: lineconfig.labelDistance ? Number(lineconfig.labelDistance) : 5,
                formatter: lineconfig.labelFormatter || '{c}',
                textStyle: {
                    fontSize: fontSize || getFontSize() * .7
                }
            }
        }
    }

    s = series.map((v, i) => {
        let type = v.type;
        let m = Object.assign({}, eval(`${type}model`));
        m.name = v.name;
        m.data = v.data instanceof Array ? v.data : [v.data];
        let c = [eval(`${type}color`) ? eval(`${type}color`).shift() : undefined];
        m.color = c;
        return m;
    });

    return s;
}

function getMixChartLegend(fontSize, layout, series, legendconfig) {
    let legendLeft = Number(legendconfig.left)>=0 ? legendconfig.left+'%' : null,
    legendTop = Number(legendconfig.top)>=0 ? legendconfig.top+'%' : (layout.h * getScreenSize().height / 100 < 310 ? '20%' : '18%'),
    itemGap = Number(legendconfig.itemGap)>=0 ? Number(legendconfig.itemGap) : layout.w / 10,
    itemWidth = Number(legendconfig.itemWidth)>=0 ? Number(legendconfig.itemWidth) : 25,
    itemHeight = Number(legendconfig.itemHeight)>=0 ? Number(legendconfig.itemHeight) : 14;

    let legend = {
        show: !legendconfig.hide,
        top: legendTop,
        padding: 0,
        orient: legendconfig.orient || 'horizontal',
        itemGap: itemGap,
        itemWidth: itemWidth,
        itemHeight: itemHeight,
        textStyle: {
            fontSize: fontSize || getFontSize() * 0.7
        },
        data: series.map((v, i) => {
            return v.name
        })
    };

    legendLeft ? (legend.left = legendLeft) : (legend.right = '5%');

    return legend;
}

function getLayout(layout) {
    let l = {};
    for (let k in layout) {
        l[k] = layout[k] / 10
    }
    return l;
}

function parseObjectStr(str) {
    if (!str) {
        return {};
    }
    if (typeof str == 'object') {
        return str;
    }else {
        return JSON.parse(str);
    }
}

function replaceSpecTag(str) {
    if (str) {
        if (typeof (str) === 'string') {
            return str.replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&apos;/g, '\'')
                .replace(/&quot;/g, '"')
                .replace(/&nbsp;/g, ' ');
        } else {
            return str;
        }
    } else {
        return str;
    }
}

function getScreenSize() {
    let root = document.getElementById('root');
    let height = root.offsetHeight;
    let width = root.offsetWidth;
    return { height, width };
}

function getFontSize() {
    let { height, width } = getScreenSize();
    let fontSize = width / 300 * 2 + 16 + Math.round(width / 1000) * 2;
    return fontSize;
}

function getColors(color, theme) {
    let c = getDefaultColors(theme);
    if(color && color.length > 0) {
        for(let i = 0; i < color.length; i++) {
            c[i] = color[i];
        }
    }
    return c;
}

function getDefaultColors(theme) {
    if(theme == 'blue') {
        return ["#2d8bf8", "#ebbb31", "#fe7d6b", "#46e4e8", "#91c7ae", "#749f83", "#ca8622", "#bda29a", "#6e7074", "#546570", "#c4ccd3"
        ]
    }else if(theme == 'dark') {
        return ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab', '#91ca8c','#f49f42']
    }else {
        return ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab', '#91ca8c','#f49f42']
    }
}

function getThemeColor(theme) {
    if(theme == 'blue') {
        return '#04204A';
    }else if(theme == 'dark') {
        return '#2f2e2c';
    }
}

/**
 * 获得文本展示后的高宽
 */
function getTextViewWidth(text, fontSize) {
    let sp = document.createElement('span');
    sp.innerText = text;
    sp.style.fontSize = fontSize + 'px';
    sp.style.opacity = 0;
    document.getElementById('root').appendChild(sp);
    let width = sp.getBoundingClientRect().width;
    document.getElementById('root').removeChild(sp);
    return width;
}

/**
 * 换行逻辑
 */
function wrapText(text, fontSize, width) {
    text = text.replace(/\n/g,'');
    let start = 0, splitCount = 0, splitIndexs = [];
    for(let i = 0; i < text.length; i++) {
        let st = text.substring(start, i);
        if(getTextViewWidth(st) >= width) {
            splitIndexs.push(i);
            start = i;
        }
    }
    for(let j = 0; j < splitIndexs.length; j++) {
        text = text.insert('\n', splitIndexs[j] + splitCount);
        splitCount ++;
    }
    if(text.charAt(text.length - 1) == '\n') {
        text = text.substring(0, text.length - 1);
    }
    
    return text;

}
String.prototype.insert = function(str, index){
    let newstr = "";
    let tmp = this.substring(0, index);
    let estr = this.substring(index, this.length);
    newstr += tmp + str + estr;
    return newstr;
}

export { converter };
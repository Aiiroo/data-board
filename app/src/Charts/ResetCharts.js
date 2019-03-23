export default function resetchart(option, node, sc) {
    if(option.series.length == 1) { // 布局自适应调整仅对单chart图生效
        let type = option.series[0].type;
        if(type == 'bar') {
            return resetBarOption(option, node);
        }else if(type == 'line') {
            return resetLineOption(option, node, sc);
        }else if(type == 'pie') {
            return resetPieOption(option, node);
        }else {
            return option;
        }
    }else {
        return option;
    }
}

function resetBarOption(option, node) {
    /* option.title ? option.title.subtext = node.offsetHeight < 300 ? '' : option.title.subtext : '',
    option.grid.top = option.grid.top_ ? option.grid.top_ : (node.offsetHeight < 310 ? '35%' : '28%');
    option.grid.bottom = option.grid.bottom_ ? option.grid.bottom_ : (node.offsetHeight < 310 ? '20%' : '16%');
    option.grid.left = option.grid.left_ ? option.grid.left_ : '10%';
    option.grid.right = option.grid.right_ ? option.grid.right_ : '10%';
    option.legend.top = option.legend.top_ ? option.legend.top_ : (node.offsetHeight < 310 ? '20%' : '18%');
    if(node.offsetHeight >= 450 && node.offsetWidth / option.xAxis[0].data.length >= 80) {
        option.xAxis[0].nameLocation = 'middle';
        option.xAxis[0].nameRotate = 0;
        option.xAxis[0].nameGap = node.offsetHeight/20;
    }
    option.xAxis[0].axisLabel.rotate = node.offsetWidth / option.xAxis[0].data.length < 80 ? 45 : 0; */
    return option;
}

function resetLineOption(option, node, sc) {
    /* option.grid.top = option.grid.top_ ? option.grid.top_ : (node.offsetHeight < 310 ? '35%' : '28%');
    option.grid.bottom = option.grid.bottom_ ? option.grid.bottom_ : (node.offsetHeight < 310 ? '20%' : '16%');
    option.grid.left = option.grid.left_ ? option.grid.left_ : '10%';
    option.grid.right = option.grid.right_ ? option.grid.right_ : '10%';
    option.legend.top = option.legend.top_ ? option.legend.top_ : (node.offsetHeight < 310 ? '20%' : '18%');
    if(node.offsetHeight >= 450 && node.offsetWidth / option.xAxis[0].data.length >= 80) {
        option.xAxis[0].nameLocation = 'middle';
        option.xAxis[0].nameRotate = 0;
        option.xAxis[0].nameGap = node.offsetHeight/20;
    }
    option.xAxis[0].axisLabel.rotate = node.offsetWidth / option.xAxis[0].data.length < 80 ? 45 : 0;
    option.dataZoom[0].endValue = sc >= option.xAxis[0].data.length ? option.xAxis[0].data.length - 1 : sc; */
    return option;
}

function resetPieOption(option, node) {
    option.animation = true;
    option.legend.top = option.legend.top_ ? option.legend.top_ : (node.offsetHeight > 300 ? '20%' : '15%');
    option.legend.orient = option.legend.orient_ ? option.legend.orient_ : (node.offsetHeight > 300 ? 'horizontal' : 'vertical');
    if(option.legend.left_) {
        option.legend.left = option.legend.left_;
    }else {
        option.legend.right = option.legend.orient == 'vertical' ? '10%' : (node.offsetHeight > 300 ? 'auto' : '10%');
    }

    let cx = option.series[0].centerx ? option.series[0].centerx : '50%',
        cy = option.series[0].centery ? option.series[0].centery : (node.offsetHeight > 300 ? '65%' : '55%'),
        r1 = option.series[0].radius1 ? option.series[0].radius1 : 0,
        r2 = option.series[0].radius2 ? option.series[0].radius2 : (`${node.offsetHeight/5 > 60 ? 60 : node.offsetHeight/5}%`);

    option.series[0].radius = [r1, r2];
    option.series[0].center = [cx, cy];
    return option;
}
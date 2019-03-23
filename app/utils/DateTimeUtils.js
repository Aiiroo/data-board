// 获得指定格式的时间字符串
Date.prototype.format = function(format) {
    var weekday=new Array(7)
    weekday[0]="日"
    weekday[1]="一"
    weekday[2]="二"
    weekday[3]="三"
    weekday[4]="四"
    weekday[5]="五"
    weekday[6]="六"
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "h+": ((this.getHours()>12)?((this.getHours()-12)):(this.getHours())),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        // "q+": weekday[Math.floor((this.getMonth() + 3) / 3)],
        "q": weekday[this.getDay()],
        "S": this.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
// 获得当前时间增加/减少x天后的时间
Date.prototype.addDays = function(x) {
	var DAY = 24 * 60 * 60 * 1000;
	return new Date(this.valueOf()+(x*DAY));
}

// 获得当前时间与目标时间之间间隔天数
Date.prototype.getIntervalDays = function(date) {
	var that = new Date(date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate());
	var now = new Date();
	now = new Date(now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate());
	var yesterday = addDate(now, -1);
	yesterday = new Date(yesterday.getFullYear()+"-"+(yesterday.getMonth()+1)+"-"+yesterday.getDate());
	var qiantian = addDate(now, -2);
	qiantian = new Date(qiantian.getFullYear()+"-"+(qiantian.getMonth()+1)+"-"+qiantian.getDate());
	return (that.getFullYear()!=now.getFullYear())?("year"):
			((that-now==0)?("today"):
			((that-yesterday==0)?("yesterday"):
			((that-qiantian==0)?("qiantian"):("month"))));
}
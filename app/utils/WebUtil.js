export function BrowserType() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    if(userAgent.indexOf("Opera") > -1) {
        return 'Opera';
    }else if(userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return 'IE';
    }else if(userAgent.indexOf("Edge") > -1) {
        return 'Edge'
    }else if(userAgent.indexOf("Firefox") > -1) {
        return 'Firefox';
    }else if(userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1) {
        return 'Safari';
    }else if(userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1) {
        return 'Chrome'
    }
}
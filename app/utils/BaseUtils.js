import firstBy from'thenby';

/**
 * 对象数组排序
 * @param {*} arr 
 * @param {*} keys {key,direction}
 */
function sort(arr, keys){
    if(keys.length == 0) {return arr;}
    let compare = firstBy(keys[0].key, keys[0].direction || 1);
    for(let i = 1; i< keys.length; i++) {
        compare = compare.thenBy(keys[i].key, keys[i].direction || 1);
    }
    arr.sort(compare);
    return arr;
}
/**
 * 删除数组某个值
 * @param {*} arr 
 * @param {*} val 
 */
function remove(arr, val) {
    var index = arr.indexOf(val);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
/**
 * 判断两个对象是否相等
 * @param {*} a 
 * @param {*} b 
 */
function isEqual(a,b){
    //如果a和b本来就全等
    if(a===b){
        //判断是否为0和-0
        return a !== 0 || 1/a ===1/b;
    }
    //判断是否为null和undefined
    if(a==null||b==null){
        return a===b;
    }
    //接下来判断a和b的数据类型
    var classNameA=Object.prototype.toString.call(a),
    classNameB=Object.prototype.toString.call(b);
    //如果数据类型不相等，则返回false
    if(classNameA !== classNameB){
        return false;
    }
    //如果数据类型相等，再根据不同数据类型分别判断
    switch(classNameA){
        case '[object RegExp]':
        case '[object String]':
        //进行字符串转换比较
        return '' + a ==='' + b;
        case '[object Number]':
        //进行数字转换比较,判断是否为NaN
        if(+a !== +a){
            return +b !== +b;
        }
        //判断是否为0或-0
        return +a === 0?1/ +a === 1/b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
        return +a === +b;
    }
    //如果是对象类型
    if(classNameA == '[object Object]'){
        //获取a和b的属性长度
        var propsA = Object.getOwnPropertyNames(a),
        propsB = Object.getOwnPropertyNames(b);
        if(propsA.length != propsB.length){
            return false;
        }
        for(var i=0;i<propsA.length;i++){
            var propName=propsA[i];
            //如果对应属性对应值不相等，则返回false
            //if(a[propName] !== b[propName]){
            if(!isEqual(a[propName], b[propName])){
                return false;
            }
        }
        return true;
    }
    //如果是数组类型
    if(classNameA == '[object Array]'){
        let i = 0;
        for(i; i < a.length;i++) {
            if(!isEqual(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }
}

function isEmptyObject(model) {
    var isEmpty = true;
    for (var prop in model) {
        isEmpty = false;
        break;
    }
    return isEmpty;
}

function getUrlParam(name) {   
    var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");   
    var r = window.location.search.substr(1).match(reg);   
    if (r != null) return decodeURI(r[2]); 
    return null;   
}

function hashcode(obj) {
    let str = JSON.stringify(obj);
    let hash = 0,
        i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}


export { sort, remove, isEqual, isEmptyObject, getUrlParam, hashcode };
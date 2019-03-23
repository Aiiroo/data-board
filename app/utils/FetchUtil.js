/**根据json对象创建表单对象 */
export function createFormData(jsonObj){
    if(jsonObj != null){
        var formData = new FormData();
        for(var key in jsonObj){
            formData.append(key, jsonObj[key]);
        }
        return formData
    }else{
        return null;
    }
}
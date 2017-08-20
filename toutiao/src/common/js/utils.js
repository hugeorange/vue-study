let utils = {
    dateFormat(){
        Date.prototype.format = function(format){
            var o = {
                "M+" : this.getMonth()+1,                             //month
                "d+" : this.getDate(),                                //day
                "h+" : this.getHours(),                               //hour
                "m+" : this.getMinutes(),                             //minute
                "s+" : this.getSeconds(),                             //second
                "q+" : Math.floor((this.getMonth()+3)/3),             //quarter   季度
                "S" : this.getMilliseconds()                         //millisecond  毫秒
            };

            if(/(y+)/.test(format)) {                                //年
                format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            }

            for(var k in o) {                                        //其他参数
                if(new RegExp("("+ k +")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
                }
            }
            return format;
        };
    },
    localstorage:{
        savedata(key,value){
            window.localStorage.setItem(key,JSON.stringify(value));
        },
        readdata(key){
            if(window.localStorage.key){
                return JSON.parse(window.localStorage.getItem(key));
            }
        },
        emptydata(){
            window.localStorage.clear();
        },
        removedata(){
            window.localStorage.removeItem(key)
        }
    }
};

export {utils}

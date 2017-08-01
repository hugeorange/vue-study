import axios from 'axios'
import jsonp from 'jsonp'

function ajax(kind,fn1,fn2) {
    let url = 'http://m.toutiao.com/list/?tag=' + kind + '&ac=wap&count=20&format=json_raw&as=A125A8CEDCF8987&cp=58EC18F948F79E1&min_behot_time=' + parseInt((new Date().getTime()) / 1000);
    jsonp(url, null, function (err, data) {
        if (err) {
            // console.error(err.message);
           fn2 && fn2(err.message);
        } else {
            // console.log(data);
           fn1 && fn1(data);
        }
    });
}
export {ajax}

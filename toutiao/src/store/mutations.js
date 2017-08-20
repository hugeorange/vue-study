/**
 * Created by orange on 2017/8/13.
 */
import {utils} from '../common/js/utils'
//全局触发事件
export default {
    increment (state){
        state.count++;
    },
    decrement (state){
        state.count--;
    },
    addCollection(state,item){
        state.collectionNews.push(item);
        utils.localstorage.savedata('news',state.collectionNews);
    },
    initCollection(state,item){
        state.collectionNews = item;
    },
    addNewsArr(state,item){
        state.newsArr = item;
    },
    reduceCollection(state){

    }
}

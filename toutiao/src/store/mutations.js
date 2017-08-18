/**
 * Created by orange on 2017/8/13.
 */

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
    },
    reduceCollection(state){

    }
}

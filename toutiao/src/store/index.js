/**
 * Created by orange on 2017/8/13.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        count:0,
        collectionNews:[],
        newsArr:[]
    },
    //使用处进行 commit
    mutations,
    getters:{
        nowTime(state){
            return new Date() - 0 + '-' + state.count;
        },
        getNewsList(state){
            return state.collectionNews;
        },
        getNewsArr(state){
            return state.newsArr;
        }
    }
});
export default store;

<template>
  <div class="singer" ref="singer">
		<list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <!-- <keep-alive> -->
		  <router-view></router-view>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
import {mapMutations} from 'vuex'  // vuex提供的语法糖,对Mutations进行一层封装

import ListView from '@/base/listview/listview'
import {getSingerList} from '@/api/singer';
import {ERR_OK} from '@/api/config';
import Singer from '@/common/js/singer'; // 此处封装成一个 Singer 类是否有必要？
import {playlistMixin} from '@/common/js/mixin'


const HOT_NMAE = "热门"
const HOT_SINGER_LEN = 10

export default {
  name: 'Singer',
  components: {
    ListView,
  },
  mixins: [playlistMixin],
  data() {
    return {
      singers: [],
    }
  },
  created() {
    this._getSingerList();
  },
  methods: {
    handlePlaylist(playlist) {  // 只有这里调用了handlePlaylist方法，才不会报错（覆盖了mixin.js里的抛出异常方法）
      const bottom = playlist.length > 0 ? '60px' : '' // 当存在播放队列
      this.$refs.singer.style.bottom = bottom  // 用于处理当底部存在mini播放器时遮挡底部列表的bug
      this.$refs.list.refresh()
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list);
        }
      }, err => {
        console.log(err);
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NMAE,
          items: []
        }
      }

      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid            
          }))
        }

        let key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      });
      // 拍成数组，变成有序列表
      let hot = [];
      let ret = [];
      let rest = [];
      for (let key in map) {
        if (key === 'hot') {
          hot.push(map[key])
        } else if (/[a-zA-Z]/.test(key)) {
          ret.push(map[key]);
        } else {
          rest.push(map[key]);
        }
      }
      ret.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
      rest.sort((a, b) => a.title - b.title)
      return [...hot, ...ret, ...rest];
    },
    selectSinger(item) {
      console.log(item);
      this.$router.push(`/singer/${item.id}`)
      this.setSinger(item) // 等于执行了mutations.js里的对应方法
    },
    // 对象映射(把对mutations的修改映射成一个方法名 setSinger)
    ...mapMutations({  
      setSinger: 'SET_SINGER'   
    })
  }
}
</script>

<style lang="stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
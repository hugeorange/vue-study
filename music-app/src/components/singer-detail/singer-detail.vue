<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'  // 取数据提供的语法糖

  import {getSingerDetail} from '@/api/singer' // 获取歌手详细数据
  import {ERR_OK} from '@/api/config'
  import {createSong} from '@/common/js/song'
  import MusicList from '@/components/music-list/music-list'

  export default {
    data(){
      return {
        songs:[]  // 歌曲列表
      }
    },
    computed: { 
      title(){  // 标题
        return this.singer.name
      },       
      bgImage(){   // 背景图
        return this.singer.avatar
      },
      // 对应到store/getters.js 里的singer (获取到列表页点击的歌手对应详细数据)
      ...mapGetters([
        'singer'
      ])
    },
    created(){
      this._getDetail() 
    },
    methods:{
      _getDetail() {
        // 这里的this.singer数据 是通过vuex获取的，所以在歌手详情页刷新的话会获取不到数据，在此做判断做回退操作(边距数据的处理)
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then(res => {
          if (res.code === ERR_OK) {
            this._normalizeSongs(res.data.list);
          }
        })
      },
      _normalizeSongs(list) {
        let ret =[]
        list.forEach(item => {
          const {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData));
          }
        })
        this.songs = ret;
      }
    },
    components:{
      MusicList
    }  
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: $color-background
</style>
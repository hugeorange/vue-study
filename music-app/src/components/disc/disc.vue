<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from '@/components/music-list/music-list'
  import {getSongList} from '@/api/recommend'
  import {ERR_OK} from '@/api/config'
  import {mapGetters} from 'vuex'
  import {createSong} from '@/common/js/song'

  export default {
    components: {
      MusicList
    },
    computed: {
      title() {  //标题
        return this.disc.dissname
      },
      bgImage() {  //背景图
        return this.disc.imgurl
      },
      ...mapGetters([  //接收数据
        'disc'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {         
        // 若在当前页刷新，则退回到列表页（this.disc数据是从通过vuex从recommend组件中带过来的，直接刷新当前页获取不到）
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }

        getSongList(this.disc.dissid).then((res) => {          
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to   // 左滑动画效果
    transform: translate3d(100%, 0, 0)
</style>
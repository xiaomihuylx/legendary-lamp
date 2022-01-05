<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control ref="topTab" v-show="showTabControl" class="tab-control" @tabClick="tabClick"></tab-control>
    <scroll :probe-type="3"
            :pull-up-load="true"
            class="content"
            :data="[showGoodsList]"
            @pullingUp="loadMore"
            @scroll="contentScroll"
            ref="scroll">
      <home-swiper ref="hSwiper" :banners="banners" @swiperLoaded="swiperLoaded"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control ref="contentTab" class="tab-control" @tabClick="tabClick"></tab-control>
      <goods-list :goods="showGoodsList"></goods-list>
    </scroll>
    <back-top v-show="showBackTop" @click.native="backTop"/>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from '../../components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'

  import {getMultiData, getProductData} from "network/home";
  import {TOP_DISTANCE, POP, NEW, SELL} from "common/const";
  import {backTopMixin} from "common/mixin";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll
    },
    mixins: [backTopMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 1, list: []},
          'new': {page: 1, list: []},
          'sell': {page: 1, list: []},
        },
        currentType: POP,
        showTabControl: false,
        tabOffsetTop: 0,
        saveY: 0
      }
    },
    computed: {
      showGoodsList() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      // 1.请求轮播等数据
      this._getMultiData()

      // 2.请求商品数据
      this._getProductData(POP)
      this._getProductData(NEW)
      this._getProductData(SELL)

      // 3.监听一些事件
      this.$bus.$on('imgLoad', () => {
      	this.$refs.scroll.refresh()
      })
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
	    this.saveY = this.$refs.scroll.scrollY
    },
    methods: {
      /**
       * 网络请求
       */
      _getMultiData() {
        getMultiData().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      _getProductData(type) {
        // 获取页码
        const page = this.goods[type].page
        getProductData(type, page).then(res => {
          const newList = res.data.list
          this.goods[type].list.push(...newList)
          this.goods[type].page += 1

          // 完成加载更多数据
          this.$refs.scroll.finishedPullUp()
        })
      },
      /**
       * 事件监听
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = POP
            break
          case 1:
            this.currentType = NEW
            break
          case 2:
            this.currentType = SELL
            break
        }

        this.$refs.contentTab.currentIndex = index
        this.$refs.topTab.currentIndex = index
      },
      loadMore() {
        this._getProductData(this.currentType)
      },
      contentScroll(position) {
        this.showBackTop = position.y <= -TOP_DISTANCE
        this.showTabControl = position.y <= -this.tabOffsetTop
      },
	    swiperLoaded() {
		    this.tabOffsetTop = this.$refs.contentTab.$el.offsetTop;
	    }
    }
  }
</script>

<style scoped>
  #home {
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    position: relative;
    z-index: 9;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>

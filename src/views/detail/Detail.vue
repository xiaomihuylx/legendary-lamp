<template>
  <div id="detail">
    <detail-nav-bar @titleClick="selectIndex" :current-index="currentIndex"/>
    <scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            :probe-type="3"
            :data="[topImages, goods, shop, detailInfo, paramInfo, goodsList]">
      <detail-swiper :images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="goodsList"/>
    </scroll>
    <back-top v-show="showBackTop" @click.native="backTop"/>
    <!--<cart-button @click.native="cartClick"/>-->
    <detail-bottom-bar @detailAddToCart="detailAddToCart"/>
    <toast ref="toast"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'
  import CartButton from './childComps/CartButton'

  import GoodsList from 'components/content/goods/GoodsList'

  import Scroll from 'components/common/scroll/Scroll'

  import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "network/detail";
  import {backTopMixin} from "common/mixin";
  import {mapActions} from 'vuex'

  import Toast from 'components/common/toast/Toast'

  export default {
    name: "Detail",
    components: {
	    DetailParamInfo,
    	DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
	    DetailShopInfo,
      DetailGoodsInfo,
      DetailCommentInfo,
      CartButton,
	    GoodsList,
      DetailBottomBar,
      Scroll,
      Toast
    },
    mixins: [backTopMixin],
    data() {
      return {
      	iid: '',
        topImages: [],
        goods: {},
        shop: {},
	      detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        goodsList: [],
        themeTops: [],
        currentIndex: 0
      }
    },
    created() {
    	// 1.取出iid
      this.iid = this.$route.query.iid

      // 2.发送商品请求
      this._getDetail(this.iid)

      // 3.请求推荐请求
      this._getRecommend()
    },
    methods: {
      ...mapActions({
        addCart: 'addToCart'
      }),
	    imageLoad() {
	    	this.$refs.scroll.refresh()
        // 获取对应的offsetTop
        this.themeTops = []
        this.themeTops.push(0)
        this.themeTops.push(this.$refs.param.$el.offsetTop)
        this.themeTops.push(this.$refs.comment.$el.offsetTop)
        this.themeTops.push(this.$refs.recommend.$el.offsetTop)
        this.themeTops.push(Number.MAX_VALUE)
	    },
	    selectIndex(index) {
		    this.$refs.scroll.scrollTo(0, -this.themeTops[index], 500)
	    },
	    contentScroll(position) {
	    	// 决定backTop按钮是否显示
		    this.showBackTop = position.y <= -1000
	    	// 监听滚动到某个主题
        this._listenScrollTheme(-position.y)
	    },
      _listenScrollTheme(position) {
	      let length = this.themeTops.length;
	      for (let i = 0; i < length; i++) {
		      let iPos = this.themeTops[i];
		      /**
		       * 判断的方案:
		       *  方案一:
		       *    条件: (i < (length-1) && currentPos >= iPos && currentPos < this.themeTops[i+1]) || (i === (length-1) && currentPos >= iPos),
		       *    优点: 不需要引入其他的内容, 通过逻辑解决
		       *    缺点: 判断条件过长, 并且不容易理解
		       *  方案二:
		       *    条件: 给themeTops最后添加一个很大的值, 用于和最后一个主题的top进行比较.
		       *    优点: 简洁明了, 便于理解
		       *    缺点: 需要引入一个较大的int数字
		       * 疑惑: 在第一个判断中, 为什么不能直接判断(currentPos >= iPos)即可?
		       * 解答: 比如在某一个currentPos大于第0个时, 就会break, 不会判断后面的i了.
		       */
		      if (position >= iPos && position < this.themeTops[i+1]) {
			      if (this.currentIndex !== i) {
				      this.currentIndex = i;
			      }
			      break;
		      }
	      }
      },
	    cartClick() {
	    	this.$router.push('/cart')
      },
	    detailAddToCart() {
        // 2.将商品信息添加到Store中
        const obj = {}
        obj.iid = this.iid
        obj.imgURL = this.topImages[0]
        obj.title = this.goods.title
        obj.desc = this.goods.desc
        obj.price = this.goods.realPrice
        // this.$store.dispatch('addToCart', obj).then(() => {
	       //  this.$toast({message: '加入购物车成功'})
        // })
        this.addCart(obj).then(() => {
	        this.$toast({message: '加入购物车成功'})
        })
	    },
    	_getDetail(iid) {
        getDetail(iid).then(res => {
        	// 1.获取数据
          const data = res.result
	        console.log(data);

	        // 2.获取顶部的图片数据
          this.topImages = data.itemInfo.topImages

          // 3.获取商品信息
          this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

          // 4.获取店铺信息
          this.shop = new Shop(data.shopInfo)

          // 5.获取商品详细信息
          this.detailInfo = data.detailInfo

          // 6.保存参数信息
          this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

          // 7.保存评论数据
	        if (data.rate.list) {
		        this.commentInfo = data.rate.list[0];
	        }
        })
      },
	    _getRecommend() {
	    	getRecommend().then(res => {
	    		this.goodsList = res.data.list
		    })
      }
    }
  }
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 1;
    background-color: #fff;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 58px;
    left: 0;
    right: 0;
  }
</style>
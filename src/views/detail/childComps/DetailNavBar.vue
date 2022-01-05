<template>
  <nav-bar>
    <img slot="left" class="back" @click="backClick" src="~assets/img/common/back.svg" alt="">
    <div slot="center" class="title">
      <div class="title-item"
           v-for="(item, index) in titles"
           @click="titleClick(index)"
           :class="{active: currentIndex === index}">
        {{item}}
      </div>
    </div>
  </nav-bar>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'

	export default {
		name: "DetailNavBar",
    props: {
			titles: {
				type: Array,
        default: () => {
        	return ['商品', '参数', '评论', '推荐']
        }
      },
      currentIndex: {
				type: Number,
        default: 0
      }
    },
    // data() {
			// return {
			// 	currentIndex: 0
    //   }
    // },
    components: {
			NavBar
    },
    methods: {
	    backClick() {
	    	this.$router.back()
      },
	    titleClick(index) {
        this.$emit('titleClick', index)
      }
    }
	}
</script>

<style scoped>
  .back {
    margin-top: 12px;
  }

  .title {
    display: flex;
    padding: 0 20px;
  }

  .title-item {
    flex: 1;
    font-size: 14px;
  }

  .title-item.active {
    color: var(--color-high-text)
  }
</style>
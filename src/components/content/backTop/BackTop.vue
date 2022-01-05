<template>
  <div class="back-top">
    <img src="~assets/img/common/top.png" alt="">
  </div>
</template>

<script>
  export default {
    name: "BackTop"
  }
</script>

<style scoped>
  .back-top {
    position: fixed;
    bottom: 55px;
    right: 5px;

    z-index: 9;

    width: 45px;
    height: 45px;
  }

  .back-top img {
    width: 100%;
  }
</style>
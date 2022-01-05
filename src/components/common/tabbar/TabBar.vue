<template>
  <div class="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "TabBar"
  }
</script>

<style scoped>
  .tab-bar {
    background-color: #f6f6f6;
    height: 49px;
    border-top: 1px solid #eee;
    box-shadow: 0 -1px 1px rgba(150,150,150,.08);

    position: fixed;   
    /*  左右，都设置为 0  就可以让它宽度填满页面   */
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    /* vertical-aling 设置行内元素垂直对齐方式，行内元素的基线相对于所在行的基线位置  */
    /* text-align 可以设置文本具有文本属性的元素（行内元素，行内块元素）他们 的水平对齐方式 */
    text-align: center;
  }
</style>

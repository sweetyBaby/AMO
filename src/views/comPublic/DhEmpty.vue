<template>
  <div class="content" :style="bodyContent">
    <div class="showImg"></div>
    <div class="tipTitle">没有内容！大家都去外星了</div>
  </div>
</template>
<script>
export default {
  created() {
  },
  components: {},
  data() {
    return {
      bodyContent: {
        // height: document.body.clientHeight-224+ "px",
        // width: document.body.clientHeight +246+ "px"
      }
    }
  },
  methods: {
    digui(num1) {
      if (num1 > 3) {
        digui(--num1)
      }
      console.log(num1)
    }
  }
}
</script>
<style lang="less">
.ant-table-placeholder{
    border: 0;
}
.content {
  width: 100%;
  height: 100%;
  background: white;

  .showImg {
    height: 396px;
    width: 450px;
    text-align: center;
    margin: auto;
    background: url("../../assets/empty.svg") no-repeat center;
    // background-size: cover;
  }

  .tipTitle {
    text-align: center;
    height: 28px;
    font-size: 20px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    line-height: 28px;
  }
}
</style>

<template>
  <div class="scanEmpty">
    <h4>请在下方选择一种方式添加发票</h4>
    <div class="scanInfo">
      <div class="scanBor"></div>
      <div class="scanList">
        <span class="scanIcon"><i class="iconfont icon-scan" /></span>
        <div class="scanMain" @click="handleScan">
          <h3>扫码添加</h3>
          <p>扫码添加发票</p>
        </div>
      </div>
      <div class="scanBor"></div>
      <div class="scanList" @click="handleImg">
        <span class="scanIcon"><i class="iconfont icon-plus" /></span>
        <div class="scanMain">
          <h3>图片识别</h3>
          <p>一次最多9张图片</p>
        </div>
      </div>
      <div class="scanBor"></div>
      <div class="scanList" @click="handleManual">
        <span class="scanIcon"><i class="iconfont icon-plus" /></span>
        <div class="scanMain">
          <h3>手工录入</h3>
          <p>手动填写发票</p>
        </div>
      </div>
      <div class="scanBor"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScanEmpty',
  props: ['scanEmpty'],
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {
    handleImg() {
      this.$emit('imgRecog', 'imgRecog')
    },
    handleManual() {
      this.$emit('manual', 'manual')
    },
    handleScan() {
      this.$emit('scan', 'scan')
    }
  },
}
</script>

<style lang="less">
  .scanEmpty{
    width: 100%;
    text-align: center;
    padding: 68px 160px;
    h4{
      color: rgba(147, 147, 147, 1);
      font-size: 14px;
      padding: 0 0 40px 0;
    }
    .scanInfo{
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-around;
      .scanBor{
        width: 1px;
        height: 100%;
        min-height: 80px;
        display: inline-block;
        background: rgba(236, 236, 236, 1);
      }
      .scanList{
        position: relative;
        padding: 12px 40px 12px 94px;
        cursor: pointer;
        box-shadow:none;
        margin-top: 0;
        .scanIcon{
          position: absolute;
          left: 18px;
          top: 12px;
          width: 50px;
          height: 50px;
          border-radius:25px;
          background: white;
          border: 2px solid rgba(62, 77, 168, 1);
          line-height: 46px;
          .iconfont{
            color: rgba(251, 199, 115, 1);
            font-size: 30px;
          }
        }
        &:hover{
          background: rgba(251, 251, 251, 1);
        }
        .scanMain{
          text-align: left;
          width: 100%;
          h3{
            font-size: 18px;
            color: rgba(62, 77, 168, 1);
          }
          p{
            color: rgba(147, 147, 147, 1);
            font-size: 14px;
            margin: 0 ;
          }
        }
      }
    }

  }
</style>

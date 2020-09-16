<template>
  <div class="dataCard">
    <span><icon-font :type="dataInfo.icon" /></span>
    <div class="cardTotal">
      <h1>{{ dataInfo.total }}</h1>
      <p>{{ dataInfo.title }}</p>
    </div>
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1150480_q5869xib80d.js',
})

export default {
  name: 'DataCard',
  props: ['data'],
  components: {
    IconFont
  },
  mounted() {
    this.dataInfo = this.data
  },
  data() {
    // console.info('this.data----',this.data)
    return {
      dataInfo: [],
    }
  }
}
</script>

<style lang="less">
  .dataCard{
    width: 100%;
    padding: 18px 30px;
    box-sizing: border-box;
    border:1px solid rgba(229,240,255,1);
    opacity:1;
    border-radius:4px;
    margin: 0 0 20px 0;
    span{
      width: 64px;
      height: 64px;
      border-radius:32px;
      float: left;
      text-align: center;
      line-height: 64px;
      background: rgba(229, 240, 255, 1);
      margin: 0 18px 0 0;
      .anticon {
        font-size: 64px;
        display: inline-block;
      }
    }
    h1{
      font-size: 22px;
      color: rgba(66, 131, 255, 1);
      font-weight: bold;
      line-height: 26px;
      padding:5px 0 8px 0;
      margin: 0;
    }
    p{
      font-size: 14px;
      color: rgba(141, 156, 176, 1);
      line-height: 19px;
    }
  }
</style>

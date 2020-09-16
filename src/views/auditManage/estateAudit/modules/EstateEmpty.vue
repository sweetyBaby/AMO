<template>
  <div class="scanEmpty" :style="pageStyle">
    <h4 v-if="isTitle">请在下方选择一种方式添加产品</h4>
    <div class="scanInfo">
      <div class="scanBor"></div>
      <div class="scanList" @click="handleNoAudit">
        <span class="scanIcon"><i class="iconfont icon-est-audit"></i></span>
        <div class="scanMain" >
          <h3>手工新增</h3>
          <p>发票手工新增</p>
        </div>
      </div>
      <div class="scanBor"></div>
      <div class="scanList" @click="handleWareDoc">
        <span class="scanIcon"><i class="iconfont icon-est-ware"></i></span>
        <div class="scanMain" >
          <h3>出入库单凭证</h3>
          <p>添加出库单凭证</p>
        </div>
      </div>
      <div class="scanBor"></div>
      <div class="scanList" @click="handlePursure">
        <span class="scanIcon"><i class="iconfont icon-est-pursure"></i></span>
        <div class="scanMain">
          <h3>合同</h3>
          <p>添加合同附件</p>
        </div>
      </div>
      <div class="scanBor"></div>
      <div class="scanList" @click="handleNoSupport">
        <span class="scanIcon"><i class="iconfont icon-est-noSupport"></i></span>
        <div class="scanMain">
          <h3>无支持件</h3>
          <p>添加无支持件附件</p>
        </div>
      </div>
      <div class="scanBor"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EstateEmpty',
  props: ['scanEmpty', 'isNoBack', 'isTitle'],
  data () {
    return {
      isWareIn: true,
      isDeliveryOut: false,
      isStained: false,
      proAllot: false,
      isBack: false,
      pageStyle: {}
    }
  },
  mounted () {
    // console.info('scanEmpty---',this.scanEmpty)
    this.isBack = this.isNoBack
    if (!this.isTitle) {
      this.pageStyle = {
        'padding': '24px 0'
      }
    }
  },
  methods: {
    handleNoClick () {
      this.$emit('click', { type: 'noUdi' })
    },
    handlePreClick () {
      this.$emit('click', { type: 'preStorage' })
    },
    handlePreInClick () {
      this.$emit('click', { type: 'preStorageIn' })
    },
    handleWholeClick () {
      this.$emit('click', { type: 'whole' })
    },
    handleUdiClick () {
      this.$emit('click', { type: 'udi' })
    },
    handleWareDoc () {
      this.$emit('click', { type: 'wareDoc' })
    },
    handleNoAudit () {
      this.$emit('click', { type: 'noUdi' })
    },
    handlePursure () {
      this.$emit('click', { type: 'purSure' })
    },
    handleNoSupport () {
      this.$emit('click', { type: 'noSupport' })
    }
  }
}
</script>

<style lang="less">
  .scanEmpty{
    width: 100%;
    text-align: center;
    padding: 70px 160px;

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

  @media screen and ( max-width:1280px){
    .scanEmpty{
      padding: 68px 24px;
    }
  }
</style>

<template>
  <div class="scanEmpty">
    <h4>请在下方选择一种方式添加产品</h4>
    <div class="scanInfo">
      <div class="scanBor"></div>
      <div class="scanList" @click="handleScan">
        <span class="scanIcon"><i class="iconfont icon-scan" /></span>
        <div class="scanMain" >
          <h3>扫码添加</h3>
          <p>单击扫码添加</p>
        </div>
      </div>
      <div class="scanBor" v-if="!proAllot && !isNoShow"></div>
      <div class="scanList" @click="handleNoClick" v-if="!proAllot && !isNoShow">
        <span class="scanIcon"><i class="iconfont icon-plus" /></span>
        <div class="scanMain">
          <h3>无码</h3>
          <p>添加无码产品</p>
        </div>
      </div>
      <div class="scanBor" v-if="isWareIn && !isBack && !proAllot"></div>
      <div class="scanList" @click="handlePreClick" v-if="isWareIn && !isBack && !proAllot">
        <span class="scanIcon"><i class="iconfont icon-preStorage" /></span>
        <div class="scanMain">
          <h3>预入库</h3>
          <p>从预入库新增</p>
        </div>
      </div>
      <div class="scanBor" v-if="proAllot || isStained "></div>
      <div class="scanList" @click="handlePreInClick" v-if="proAllot || isStained">
        <span class="scanIcon"><i class="iconfont icon-proIn" /></span>
        <div class="scanMain">
          <h3>在库产品</h3>
          <p>在库产品新增</p>
        </div>
      </div>
      <div class="scanBor" v-if="isWareIn && !isBack && !proAllot"></div>
      <div class="scanList" @click="handleWholeClick" v-if="isWareIn && !isBack && !proAllot" @click.stop="isWholeShow">
        <span class="scanIcon"><i class="iconfont icon-orderIn" /></span>
        <div class="scanMain">
          <h3>整单入库</h3>
          <p>单据号一键入库</p>
        </div>
      </div>
      <div class="scanBor" v-if="isDeliveryOut || proAllot"></div>
      <div class="scanList" v-if="isDeliveryOut || proAllot" @click="handleUdiClick">
        <span class="scanIcon"><i class="iconfont icon-udiMore" /></span>
        <div class="scanMain">
          <h3>批量添加</h3>
          <p>换行输入多个码</p>
        </div>
      </div>
      <div class="scanBor"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScanEmpty',
  props: ['scanEmpty', 'isNoBack'],
  data() {
    return {
      isWareIn: true,
      isDeliveryOut: false,
      isStained: false,
      proAllot: false,
      isBack: false,
      isNoShow: false, // 无码新增
    }
  },
  created() {
    this.getFirst()
  },
  methods: {
    handleNoClick() {
      this.$emit('click', { type: 'noUdi' })
    },
    handlePreClick() {
      this.$emit('click', { type: 'preStorage' })
    },
    handlePreInClick() {
      this.$emit('click', { type: 'preStorageIn' })
    },
    handleWholeClick() {
      this.$emit('click', { type: 'whole' })
    },
    handleUdiClick() {
      this.$emit('click', { type: 'udi' })
    },
    isWholeShow() {
      this.$emit('whole')
    },
    handleScan() {
      this.$emit('click', { type: 'scan' })
    },
    getFirst () {
      // console.info('this.scanEmpty=====', this.scanEmpty)
      if (this.scanEmpty === 'wareIn') {
        this.isWareIn = true
        this.isDeliveryOut = false
        this.isStained = false
        this.proAllot = false
      } else if (this.scanEmpty === 'delivery' || this.scanEmpty === 'proBack') {
        this.isWareIn = false
        this.isDeliveryOut = true
        this.isStained = false
        this.proAllot = false
        if (this.scanEmpty === 'proBack') {
          this.isNoShow = true
        } else {
          this.isNoShow = false
        }
      } else if (this.scanEmpty === 'stainedOut') {
        this.isWareIn = false
        this.isDeliveryOut = false
        this.isStained = true
        this.proAllot = false
      } else if (this.scanEmpty === 'proAllot') {
        this.isWareIn = false
        this.isDeliveryOut = false
        this.isStained = false
        this.proAllot = true
      }
      this.isBack = this.isNoBack
    }
  },
  watch: {
    scanEmpty (newVal, oldVal) {
      this.getFirst()
    },
    isNoBack(newD, oldD) {
      this.isBack = newD
    }
  },
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

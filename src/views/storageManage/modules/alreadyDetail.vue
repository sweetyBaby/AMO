<template>
  <a-modal
    title="产品名称"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    class="product_detail"
  >
    <div class="content">
      <div class="left">
        <ul class="list_ul">
          <li class="list_li">
            <div class="title">
              产品名称
            </div>
            <div class="text">
              过氧化氢溶液的密封胶囊。 配合过氧化氢低温等离子 灭菌装置，杀灭细菌芽孢
            </div>
          </li>
          <li class="list_li">
            <div class="title">
              产品型号
            </div>
            <div class="text">
              过氧化氢溶液的密封胶囊。 配合过氧化氢低温等离子 灭菌装置，杀灭细菌芽孢
            </div>
          </li>
          <li class="list_li">
            <div class="title">
              产品批号
            </div>
            <div class="text">
              L52312804728
            </div>
          </li>
          <li class="list_li">
            <div class="title">
              产品批号
            </div>
            <div class="text">
              L52312804728
            </div>
          </li>
          <li class="list_li">
            <div class="title">
              产品批号
            </div>
            <div class="text">
              L52312804728
            </div>
          </li>
        </ul>
      </div>
      <div class="right">
        <div class="title">产品码</div>
        <div class="text">
          BIO123657965242 1231123657965
        </div>
        <div class="code">
          code
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'InviteModal',
  data () {
    return {
      visible: false,
      confirmLoading: false,
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
<style lang="less">
.product_detail{
  .ant-modal-body{
    background:#F7FAFF;
    padding: 0;
  }
}
</style>

<style lang="less" scoped>
.content{
  display: flex;
  .left{
    width:70%;
    height:900px;
    max-height: 300px;
    overflow: auto;
    background: #fff;
    padding:24px;
    .list_ul{
      list-style: none;
      padding:0;
       .list_li{
         list-style: none;
      border-bottom: 1px solid #E5F0FF;
      padding-bottom: 19px;
      .title{
        color:#8D9CB0;
        font-size: 14px;
      }
      .text{
        color: #2F3C5D;
        font-size: 18px;
      }
    }
    }

  }
  .right{
    padding:24px;
    flex:1;
    position: relative;
    .title{
      color:#8D9CB0;
      font-size: 14px;
    }
    .text{
      color:#2F3C5D;
      font-size:20px;
    }
    .code{
      position: absolute;
      bottom:0;
    }
  }
}
</style>

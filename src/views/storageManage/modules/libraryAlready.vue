<template>
  <a-card :bordered="false">
    <div class="page_Title">
      <div class="flex_left">
        <h3>已盘 178789</h3>
        <span class="person">盘库人数:3</span>
        <a-input placeholder="Basic usage" style="width:170px;">
          <i slot="prefix" class="iconfont icon-cancle"></i>
        </a-input>
      </div>
      <div>
        <ul class="toolbar">
          <i class="iconfont icon-back"></i>
          <i class="iconfont icon-plus" @click="addProduct"></i>
          <i class="iconfont icon-plus" @click="invite"></i>
          <i class="iconfont icon-save"></i>
        </ul>
      </div>
    </div>
    <div class="content">
      <div class="card_box active" v-for="i in 5 " :key="i">
        <div class="left">
          <div style="margin:auto;width:70px;height:70px;">
            <i class="iconfont iconzhongbiao"></i>
          </div>
          <div class="time">17:21</div>
          <div class="date">2019年05月6号</div>
        </div>
        <div class="right">
          <p class="title">BHHJJSPJNHGVHBH</p>
          <ul class="details">
            <li>
              <p>产品名称</p>
              <p>可重复</p>
            </li>
            <li>
              <p>产品型号</p>
              <p>可重复</p>
            </li>
            <li>
              <p>失效日期</p>
              <p>可重复</p>
            </li>
            <li>
              <p>产品来源</p>
              <p>可重复</p>
            </li>
            <li>
              <p>产品批号</p>
              <p>可重复</p>
            </li>
          </ul>
        </div>
        <div class="detail" @click="showDetail">
          <i class="iconfont icon-save"></i>
        </div>
      </div>
    </div>
    <invite-modal ref="inviteModal"></invite-modal>
    <add-product-modal ref="addProductModal"></add-product-modal>
    <already-detail ref="alreadyDetail"></already-detail>
  </a-card>
</template>

<script>
import inviteModal from './inviteModal'
import addProductModal from './addProductModal'
import alreadyDetail from './alreadyDetail'
export default {
  name: 'LibraryAlready',
  components: {
    inviteModal,
    addProductModal,
    alreadyDetail
  },
  data() {
    return {

    }
  },
  created() {},
  methods: {
    // 新增商品
    addProduct() {
      this.$refs.addProductModal.show()
    },
    // 邀请
    invite() {
      this.$refs.inviteModal.show()
    },
    // 显示已盘详情
    showDetail() {
      this.$refs.alreadyDetail.show()
    }
  }
}
</script>
<style lang="less" scoped>
.page_Title{
  .flex_left{
    display:flex;
    align-items: center;
    p{
      color:#2F3C5D;
    }
    span.person{
      margin:0 79px;
      color:#8D9CB0;
      font-size: 14px;
    }
  }
}
.card_box{
  background:rgba(255,255,255,1);
  border:1px solid rgba(229,240,255,1);
  opacity:1;
  border-radius:4px;
  display: flex;
  align-items: stretch;
  padding:10px 0;
  margin-bottom: 24px;
  position: relative;
  .detail{
    position:absolute;
    right:0;
    top:0;
    i{
    font-size: 32px;
    }
  }
  &.active{
    border-left:8px solid#FF9F67;
    border-radius:4px 0px 0px 4px;
  }
  .left{
    width:20%;
    text-align: center;
    .time{
      color:#BECEE3;
      font-size:32px;
    }
    .date{
      color:#BECEE3;
      font-size:14px;
    }
  }
  .right{
    position: relative;
    width:80%;
    p{
      margin: 0;
    }
    p.title{
      color:#2F3C5D;
      font-size:24px;
      line-height: 14px;
      margin-bottom: 16px;
    }
    .details{
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      padding: 0;
      margin: 0;
      position: absolute;
      width: 100%;
      bottom: 0;
      li{
        width:33.3333%;
        font-size:14px;
        line-height: 20px;
        color:#8D9CB0;
      }
    }
  }
}
</style>

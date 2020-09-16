<template>
  <a-card :bordered="false">
    <div class="page_Title">
      <div class="flex_left">
        <template>
          <h3>盘库成员 62人</h3>
          <span class="person">注：盘库创建后7日内有效，失效后自动关闭不能再盘库。</span>
        </template>
      </div>
      <div>
        <ul class="toolbar">
          <i class="iconfont icon-back"></i>
        </ul>
      </div>
    </div>
    <div class="content_main">
      <p>成员资料</p>
      <ul class="person_ul">
        <li class="person_li">
          <img src="" alt="" class="img">
          <div class="text">
            <p class="name">这里是用户名</p>
            <p class="time">加入时间：2018-05-06 15:06:30</p>
          </div>
          <div class="role">
            超级管理员
          </div>
        </li>
      </ul>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'LibraryAlready',
  components: {
  },
  data() {
    return {

    }
  },
  created() {},
  methods: {
  }
}
</script>
<style lang="less" scoped>
.content_main{
  .person_ul{
    margin-bottom: 10px;
    padding: 0;
    .person_li{
      border: 1px solid#E5F0FF;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .img{
        width: 10%;
      }
      .text{
        padding: 10px 0;
        color: #2F3C5D;
        flex:1;
        p{
          margin: 0;
        }
        .time{
          color:#B3BECC;
        }
      }
      .role{
        width:10%;
        color: #464A62;
      }
      &.active{
        border-bottom: 8px solid#4283FF;
      }
    }
  }
}
</style>

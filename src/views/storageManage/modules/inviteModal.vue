<template>
  <a-modal
    title="邀请小伙伴们一起盘库"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @cancel="handleCancel"
  >
    <p>将链接发给小伙伴，小伙伴复制后在浏览器打开，注册或登录后就可以加入</p>
    <div class="flex_box">
      <a-input v-model="inviteLink" class="inviteinput"></a-input>
      <a-button class="invitebtn">复制链接</a-button>
    </div>
    <p>链接有效期：7天内有效</p>
  </a-modal>
</template>

<script>
export default {
  name: 'InviteModal',
  data () {
    return {
      inviteLink: '',
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
<style lang="less" scoped>
.flex_box{
  display:flex;
  align-items: center;
  margin-bottom: 19px;
  .inviteinput{
    line-height:50px;
    background:rgba(247,250,255,1);
    border:1px solid rgba(205,223,252,1);
    border-radius: 4px;
    height: 50px;
    margin-right: 10px;
  }
  .invitebtn{
    background:rgba(66,131,255,1);
    border:1px solid rgba(66,131,255,1);
    opacity:1;
    border-radius:4px;
    color:#fff;
    height:50px;
  }
}
</style>

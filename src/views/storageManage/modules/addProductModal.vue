<template>
  <a-modal
    title="添加产品"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form
      :form="form"
    >
      <a-form-item
        class="input_label"
        label="输入产品"
      >
        <a-input
          class="input_filed"
          v-decorator="[
            'note',
            {rules: [{ required: true, message: 'Please input your note!' }]}
          ]"
        >
          <i class="iconfont icon-back" slot="suffix" @click="empyt"></i>
        </a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'InviteModal',
  data () {
    return {
      productCode: '',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    handleCancel () {
      this.visible = false
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          this.confirmLoading = false
        } else {
          this.confirmLoading = false
        }
      })
    },
    // 清空
    empyt() {
      this.productCode = ''
    }
  }
}
</script>
<style lang="less" scoped>
.input_label{
  .ant-form-item-label{
font-size:14px;
  font-family:Microsoft YaHei;
  font-weight:bold;
  line-height:19px;
  color:rgba(84,97,130,1);
  }

}
.input_filed{
  height:54px;
  background:rgba(247,250,255,1);
  border:1px solid rgba(205,223,252,1);
  opacity:1;
  border-radius:4px;
}
</style>

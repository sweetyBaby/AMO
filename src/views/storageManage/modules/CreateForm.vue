<template>
  <a-modal
    title="合作商"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <a-row>
        <a-col :span="24">
          <h3>合作商名称</h3>
          <p>合作商名称合作商名称合作商名称</p>
        </a-col>
        <a-col :span="8">
          <h3>合作商编号</h3>
          <p>1001</p>
        </a-col>
        <a-col :span="8">
          <h3>联系人名称</h3>
          <p>lisa</p>
        </a-col>
        <a-col :span="8">
          <h3>联系人电话</h3>
          <p>15151032348</p>
        </a-col>
        <a-col :span="24">
          <h3>合作商地址</h3>
          <p>合作商名称合作商名称合作商名称</p>
        </a-col>
        <a-col :span="24">
          <h3>经营范围</h3>
          <p>
            <a-tag>JT（关节Joint）</a-tag>
            <a-tag>JT（关节Joint）</a-tag>
            <a-tag>JT（关节Joint）</a-tag>
          </p>
        </a-col>
        <a-col :span="24">
          <h3>营业执照</h3>
          <p></p>
        </a-col>
        <a-col :span="24">
          <h3>经营资质</h3>
          <p></p>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this)
    }
  },
  methods: {
    add () {
      this.visible = true
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          setTimeout(() => {
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok', values)
          }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

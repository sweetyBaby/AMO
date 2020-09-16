<template>
  <div class="bounced">
    <a-modal
      :maskClosable="false"
      title="修改密码"
      v-model="PassVisible"
      @ok="handleOk"
      :destroyOnClose="true"
      @cancel="handCancel"
      :width="640"
    >
      <template slot="footer">
        <a-button key="back" @click="handCancel">取消</a-button>
        <a-button key="submit" :loading="loading" @click="handleOk" >确定</a-button>
      </template>
      <div class="bounced">
        <a-form layout="inline" :form="form">
          <div class="addInput">
            <div class="addInput-title">
              <small>*</small>
              <span>旧密码</span>
            </div>
            <div class="adInput-input">
              <a-form-item style="width: 100%" has-feedback>
                <a-input
                  type="password"
                  v-decorator="['oPassword', { rules: [{ required: true, message: '请输入旧密码！', whitespace: true }]}]"
                  placeholder="请输入旧密码"
                  style="width: 100%"
                />
              </a-form-item>
            </div>
          </div>
          <div class="addInput">
            <div class="addInput-title">
              <small>*</small>
              <span>新密码</span>
            </div>
            <div class="adInput-input">
              <a-form-item style="width: 100%" has-feedback>
                <a-input
                  type="password"
                  v-decorator="['password', { rules: [{ required: true, message: '6-16位密码，区分大小写' ,min:6 , max:16, whitespace: true },{ validator: validateToNextPassword,}]}]"
                  placeholder="请输入新密码"
                  style="width: 100%"
                />
              </a-form-item>
            </div>
          </div>
          <div class="addInput">
            <div class="addInput-title">
              <small>*</small>
              <span>确认新密码</span>
            </div>
            <div class="adInput-input">
              <a-form-item style="width: 100%" has-feedback>
                <a-input
                  type="password"
                  v-decorator="['bpassword', { rules: [{ required: true, message: '请确认新密码！', whitespace: true },{ validator: compareToFirstPassword,}]}]"
                  placeholder="确认新密码"
                  style="width: 100%"
                />
              </a-form-item>
            </div>
          </div>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { notification } from 'ant-design-vue'
export default {
  name: 'ChangePassword',
  components: {},
  data() {
    return {
      loading: false,
      PassVisible: false,
      sysUserCode: null,
      confirmDirty: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {},
  mounted() {},
  methods: {
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value !== form.getFieldValue('password')) {
        callback('两次密码不一样请重新输入')
      } else {
        callback()
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['bpassword'], { force: true })
      }
      if (/[^0-9a-zA-Z_]/.test(value)) {
        callback(new Error('不能有特殊字符'))
      }
      callback()
    },
    //   取消弹框
    handCancel() {
      this.PassVisible = false
    },

    showPass(sysUserCode) {
      this.sysUserCode = sysUserCode
      this.PassVisible = true
    },
    // 点击弹框确定按钮
    handleOk(e) {
      this.loading = true
      this.form.validateFieldsAndScroll((err, values) => {
        this.loading = false
        if (!err) {
          if (
            this.form.getFieldValue('password') ==
            this.form.getFieldValue('oPassword')
          ) {
            notification.error({
              message: '新密码不能与旧密码一致'
            })
          } else {
            const params = this.form.getFieldsValue()
            params.sysUserCode = this.sysUserCode
            this.axios
              .post('user/updatePassword', params)
              .then(res => {
                this.loading = false
                if (res.message === 'SUCCESS') {
                  this.PassVisible = false
                  notification.success({
                    message: '修改成功'
                  })
                } else {
                  notification.error({
                    message: '修改失败',
                    description: res.message
                  })
                }
              })
              .catch(response => {
                console.log(response)
              })
          }
        }
      })
    }
  }
}
</script>

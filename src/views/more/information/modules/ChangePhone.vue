<template>
  <div class="bounced">
    <a-modal
      :maskClosable="false"
      title="改绑手机号"
      v-model="PhoneVisible"
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
          <div class="addInput" style="  margin-top: 0px;">
            <div class="addInput-title" >
              <small>*</small>
              <span>手机号</span>
            </div>
            <div class="adInput-input">
              <a-form-item style="width: 100%" has-feedback>
                <a-input
                  v-decorator="['mobile', { rules: [{ required: true, message: '请输入手机号！', whitespace: true,pattern:/^1[3|4|5|7|8|9][0-9]\d{8}$/ }]}]"
                  placeholder="请输入手机号"
                  style="width: 100%"
                />
              </a-form-item>
            </div>
          </div>
          <div class="addInput">
            <div class="addInput-title">
              <small>*</small>
              <span>验证码</span>
            </div>
            <div class="adInput-input changePhon">
              <a-form-item style="width: 100%" has-feedback>
                <a-input
                  v-decorator="['verificationCode', { rules: [{ required: true, message: '请输入验证码！', whitespace: true }]}]"
                  placeholder="请输入验证码"
                  style="width: 75%"
                />
                <a-button @click="postCode" v-if="show">发送验证码</a-button>
                <a-button v-else>获取验证码 {{ count }}s</a-button>
              </a-form-item>
            </div>
          </div>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { verificationCode, bindingPhone } from '@/api/information'
import notification from 'ant-design-vue/es/notification'
export default {
  name: 'ChangePhone',
  //   props: ["PhoneVisible"],
  components: {},
  data() {
    return {
      loading: false,
      PhoneVisible: false,
      sysUserCode: null,
      timers: null,
      show: true,
      count: ''
    }
  },
  // 创建前的生命周期
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {},
  mounted() {},
  methods: {
    //   取消弹框
    handCancel() {
      this.show = true
      clearInterval(this.timers)
      this.timers = null
      this.PhoneVisible = false
    },
    // 展示弹框
    showphone(sysUserCode) {
      this.sysUserCode = sysUserCode
      this.PhoneVisible = true
    },

    // 点击弹框确定按钮
    handleOk(e) {
      this.loading = true
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const params = this.form.getFieldsValue()
          console.log(params.mobile)
          params.sysUserCode = this.sysUserCode
          bindingPhone(params).then(res => {
            this.loading = false
            if (res.message === 'SUCCESS') {
              notification.success({
                message: '绑定成功'
              })
              this.$store.state.user.info.mobile = params.mobile
              this.show = true
              clearInterval(this.timers)
              this.timers = null
              this.$emit('PostNewPhone', this.form.getFieldValue('mobile'))
              this.PhoneVisible = false
            } else {
              notification.error({
                message: '绑定失败'
              })
              this.show = true
              clearInterval(this.timers)
              this.timers = null
            }
          })
        } else {
          this.loading = false
        }
      })
    },

    // 发送验证码
    postCode() {
      this.form.validateFields(['mobile'], (errors, values) => {
        if (!errors) {
          const parmas = {
            type: 'bind',
            newMobile: this.form.getFieldValue('mobile')
          }
          verificationCode(parmas).then(res => {
            if (res.message === 'SUCCESS') {
              notification.success({
                message: '发送成功'
              })
              const TIME_COUNT = 60
              if (!this.timers) {
                this.count = TIME_COUNT
                this.show = false
                this.timers = window.setInterval(() => {
                  if (this.count > 0 && this.count <= TIME_COUNT) {
                    this.count--
                  } else {
                    this.show = true
                    clearInterval(this.timers)
                    this.timers = null
                  }
                }, 1000)
              }
            } else {
              notification.error({
                message: '错误',
                description: res.message
              })
            }
          })
        }
      })
    }
  }
}
</script>

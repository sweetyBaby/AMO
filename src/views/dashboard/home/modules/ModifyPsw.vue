<template>
  <a-modal
    title="改绑手机号"
    :width="640"
    :visible="visibleData.isModify"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <a-form :form="form">
        <div class="addInput" style="  margin-top: 0px;">
          <div class="addInput-title">
            <span>手机号</span>
          </div>
          <div class="adInput-input">
            <a-form-item>
              <a-input
                size="large"
                placeholder="请输入手机号"
                v-decorator="['mobile',
                              {
                                rules: [{
                                          required: true,
                                          message: '请输入正确的手机号',
                                          pattern: /^1[3456789]\d{9}$/
                                        },
                                        {
                                          validator: this.handlePhoneCheck
                                        }],
                                validateTrigger: ['change', 'blur'] }]"
                :maxLength="11"
              >
              </a-input>
            </a-form-item>
          </div>
        </div>
        <div class="addInput">
          <div class="addInput-title">
            <span>验证码</span>
          </div>
          <div class="adInput-input">
            <a-form-item>
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="16">
                  <a-input size="large" type="text" placeholder="输入验证码" v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                  </a-input>
                </a-col>
                <a-col class="gutter-row" :span="8">
                  <a
                    class="getCaptcha"
                    size="large"
                    :disabled="state.smsSendBtn"
                    @click.stop.prevent="getCaptcha"
                    v-text="!state.smsSendBtn && '获取验证码'||(state.time+' s')"></a>
                </a-col>
              </a-row>
            </a-form-item>
          </div>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getAuthCode, checkMobile, modifyUserPhone } from '@/api/auth'
import notification from 'ant-design-vue/es/notification'
export default {
  name: 'ModifyPsw',
  props: ['visibleData'],
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  data () {
    return {
      form: this.$form.createForm(this),
      state: {
        time: 60,
        smsSendBtn: false,
      },
      isTel: true,
      registerBtn: false,
      captcha: '',
      telNum: '',
      changePsw: false,
      confirmLoading: false,
    }
  },

  methods: {
    handleSubmit (e) {
      e.preventDefault()
      const _that = this
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.info('values---', values)
          if (values.captcha === _that.captcha) {
            const params = {
              id: this.visibleData.userId,
              mobile: values.mobile
            }
            modifyUserPhone(params).then(res => {
              if (res.message === 'SUCCESS') {
                this.form.setFieldsValue({
                  mobile: '',
                  captcha: ''
                })
                _that.state.smsSendBtn = false
                _that.$emit('submit', params)
              }
            })
          } else {
            notification.error({
              message: '错误提示',
              description: '请输入正确的验证码'
            })
          }
        }
      })
    },
    handlePhoneCheck (rule, value, callback) {
      callback()
    },
    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state, $message, $notification } = this
      validateFields(['mobile'], { force: true },
        (err, values) => {
          if (!err) {
            checkMobile(values).then(res => {
              console.info('该手机号是否已绑定', res)
              if (res.message !== 'SUCCESS') {
                state.smsSendBtn = true
                const interval = window.setInterval(() => {
                  if (state.time-- <= 0) {
                    state.time = 60
                    state.smsSendBtn = false
                    window.clearInterval(interval)
                  }
                }, 1000)
                const hide = $message.loading('验证码发送中..', 0)
                getAuthCode(values).then(res => {
                  setTimeout(hide, 2500)
                  console.info('mobile----', res)
                  if (res.message === 'SUCCESS') {
                    this.captcha = res.data
                  }
                }).catch(err => {
                  setTimeout(hide, 1)
                  clearInterval(interval)
                  state.time = 60
                  state.smsSendBtn = false
                  this.requestFailed(err)
                })
              } else {
                notification.error({
                  message: '错误提示',
                  description: res.data || '该手机号已绑定，请重新输入'
                })
              }
            })
          }
        }
      )
    },
    handleCancel () {
      this.form.setFieldsValue({
        mobile: '',
        captcha: ''
      })
      this.$emit('submit', false)
    }
  }
}
</script>

<style scoped lang="less">

  .getCaptcha{
    width: 100%;
    text-align: right;
    display: inline-block;
    padding: 0;
  }

  .ant-modal{
    .ant-input{
      height: 54px;
      width: 100%;
      line-height: 54px;
      background:rgba(247,250,255,1);
      border:1px solid rgba(205,223,252,1);
    }
    .addInput{
      margin: 16px 0 0 0;
      .addInput-title{
        padding: 0 0 8px 0;
        font-size: 14px;
        span{
          font-weight: bold;;
          color: rgba(84, 97, 130, 1);
        }
        small{
          color: rgba(66, 131, 255, 1);
          float: right;
          &.addInput-tips{
            color: rgba(170, 174, 185, 1);
          }
        }
      }
    }
  }

</style>

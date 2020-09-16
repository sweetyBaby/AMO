<template>
  <a-form
    class="user-layout-login"
    :form="form"
    @submit="handleSubmit"
    autocomplete="off"
    v-if="!changePsw"
  >
    <h2 style="padding: 0 0 32px 0;">忘记密码</h2>
    <a-form-item>
      <label for class="user-name">手机号</label>
      <a-input
        size="large"
        placeholder="请输入已绑定的手机号"
        v-decorator="['mobile',
                      {
                        rules: [{
                                  required: true,
                                  message: '请输入正确的手机号',
                                  pattern: /^1[03456789]\d{9}$/
                                },
                                {
                                  validator: this.handlePhoneCheck
                                }],
                        validateTrigger: ['change', 'blur'] }]"
        :maxLength="11"
      ></a-input>
    </a-form-item>
    <a-form-item>
      <label for class="user-name">验证码</label>
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="16">
          <a-input
            size="large"
            type="text"
            placeholder="请输入验证码"
            v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]"
          ></a-input>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <a
            class="getCaptcha"
            size="large"
            :disabled="state.smsSendBtn"
            @click.stop.prevent="getCaptcha"
            v-text="!state.smsSendBtn && '获取验证码'||(state.time+' s')"
          ></a>
        </a-col>
      </a-row>
    </a-form-item>
    <!-- <a-popover placement="rightTop" trigger="click" :visible="state.passwordLevelChecked">
      <template slot="content">
        <div :style="{ width: '240px' }">
          <div :class="['user-register', passwordLevelClass]">
            强度：
            <span>{{ passwordLevelName }}</span>
          </div>
          <a-progress
            :percent="state.percent"
            :showInfo="false"
            :strokeColor=" passwordLevelColor "
          />
          <div style="margin-top: 10px;">
            <span>请输入6-20个数字、字母、特殊字符组成的密码(区分大小写)。</span>
          </div>
        </div>
      </template>
      <a-form-item>
        <label for class="user-name">新密码</label>
        <a-input
          size="large"
          :type=" pswStatus1 ? 'text' : 'password' "
          @click="handlePasswordInputClick"
          autocomplete="false"
          placeholder="至少6位密码，区分大小写"
          v-decorator="['password', {rules: [{ required: true, message: '至少6位密码，区分大小写'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
        >
          <i
            slot="suffix"
            :class=" pswStatus1 ? 'iconfont icon-psw-openPsw' : 'iconfont icon-psw-missPsw' "
            :style="{ color: 'rgba(0,0,0,.25)' }"
            @click=" pswStatus1 = !pswStatus1"
          />
        </a-input>
      </a-form-item>
    </a-popover>-->
    <a-form-item>
      <label for class="user-name">新密码</label>
      <!-- <a-input
        size="large"
        :type=" pswStatus1 ? 'text' : 'password' "
        @click="handlePasswordInputClick"
        autocomplete="false"
        placeholder="6-16位密码，区分大小写"
        v-decorator="['password', {rules: [{ required: true, message: '6-16位密码，区分大小写'}, { validator: this.handleCheck }], validateTrigger: ['change', 'blur']}]"
      >-->
      <a-input
        size="large"
        :type=" pswStatus1 ? 'text' : 'password' "
        autocomplete="false"
        placeholder="请输入新密码"
        v-decorator="['password', {rules: [{ required: true, message: '6-16位密码，区分大小写' ,min:6 , max:16}, { validator: this.handleCheck }], validateTrigger: ['change', 'blur']}]"
      >
        <!-- <i
          slot="suffix"
          :class=" pswStatus1 ? 'iconfont icon-psw-openPsw' : 'iconfont icon-psw-missPsw' "
          :style="{ color: 'rgba(0,0,0,.25)' }"
          @click=" pswStatus1 = !pswStatus1"
        />-->
      </a-input>
    </a-form-item>
    <a-form-item>
      <label for class="user-name">确认密码</label>
      <a-input
        size="large"
        :type=" pswStatus2 ? 'text' : 'password' "
        autocomplete="false"
        placeholder="请再次输入新密码"
        @blur="handleConfirmBlur"
        v-decorator="['password2', {rules: [{ required: true, message: '6-16位密码，区分大小写' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
      >
        <!-- <i
          slot="suffix"
          :class=" pswStatus2 ? 'iconfont icon-psw-openPsw' : 'iconfont icon-psw-missPsw' "
          :style="{ color: 'rgba(0,0,0,.25)' }"
          @click=" pswStatus2 = !pswStatus2"
        />-->
      </a-input>
    </a-form-item>
    <a-form-item style="margin-top:24px; text-align: right;" class="noborder">
      <a-row :gutter="24">
        <a-col :span="12" style="text-align: left;">
          <a class="handleLogin" @click="handleLogin">&lt;返回登录</a>
        </a-col>
        <a-col :span="12">
          <a-button size="large" htmlType="submit" class="login-button">确认</a-button>
        </a-col>
      </a-row>
    </a-form-item>
  </a-form>
  <modify-psw v-else :mobile="telNum" />
</template>

<script>
import { getAuthCode, checkMobile } from '@/api/auth'
import { getSmsCaptcha, updatePasswordByMobile } from '@/api/login'
import ModifyPsw from './ModifyPsw'
import notification from 'ant-design-vue/es/notification'
const levelNames = {
  0: '低',
  1: '低',
  2: '中',
  3: '强'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}
export default {
  name: 'Retrieve',
  components: { ModifyPsw },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  data() {
    return {
      confirmDirty: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      isTel: true,
      registerBtn: false,
      captcha: '',
      telNum: '',
      changePsw: false,
      pswStatus1: false,
      pswStatus2: false,
      isMobile: false
    }
  },
  computed: {
    passwordLevelClass() {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName() {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor() {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    handleSubmit(e) {
      console.log('d')
      e.preventDefault()

      const _that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          //   console.info("values---", values);
          //   if (values.captcha === _that.captcha) {
          //     _that.telNum = values.mobile;
          //     _that.changePsw = true;
          //   } else {
          //     notification.error({
          //       message: "错误提示",
          //       description: "" || "重置密码失败"
          //     });
          //   }
          const params = {
            verificationCode: values.captcha,
            mobile: values.mobile,
            newPwd: values.password2
          }

          updatePasswordByMobile(params).then(res => {
            console.log(res)
            if (res.type === 'success') {
              notification.success({
                message: '密码设置成功'
              })
              this.$emit('handleLogin')
            } else {
              notification.error({
                message: res.msg
              })
            }
          })
        }
      })
    },
    handleLogin() {
      this.$emit('handleLogin')
    },
    handlePhoneCheck(rule, value, callback) {
      callback()
    },
    getCaptcha(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        $message,
        $notification
      } = this
      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          const hide = this.$message.loading('验证码发送中..', 0)
          const params = {
            mobile: values.mobile,
            type: 'forget'
          }
          getSmsCaptcha(params)
            .then(res => {
              console.log(res)
              setTimeout(hide, 2500)
              if (res.type === 'error') {
                state.smsSendBtn = false
                state.time = 60
                setTimeout(hide)
                this.$notification['error']({
                  message: '提示',
                  description: res.msg,
                  duration: 8
                })
              } else {
                state.smsSendBtn = true
                const interval = window.setInterval(() => {
                  if (state.time-- <= 0) {
                    state.time = 60
                    state.smsSendBtn = false
                    window.clearInterval(interval)
                  }
                }, 1000)
                setTimeout(hide)
                this.$notification['success']({
                  message: '提示',
                  description: '验证码获取成功',
                  duration: 8
                })
              }
            })
            .catch(err => {
              setTimeout(hide, 1)
              clearInterval(interval)
              state.time = 60
              state.smsSendBtn = false
              this.requestFailed(err)
            })
        }
      })
    },

    handlePasswordInputClick() {
      if (!this.isMobile) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },
    // 校验密码强度
    handlePasswordLevel(rule, value, callback) {
      //   let level = 0;
      // 判断这个字符串中有没有数字
      // if (/[0-9]/.test(value)) {
      //   level++;
      // }
      // // 判断字符串中有没有字母
      // if (/[a-zA-Z]/.test(value)) {
      //   level++;
      // }
      // 判断字符串中有没有特殊符号
      //   if (/[^0-9a-zA-Z_]/.test(value)) {
      //     level++;
      //   }
      // this.state.passwordLevel = level;
      // this.state.percent = level * 30;
      // if (level >= 2) {
      //   if (level >= 3) {
      //     this.state.percent = 100;
      //   }
      //   callback();
      // } else {
      //   if (level === 0) {
      //     this.state.percent = 10;
      //   }
      //   callback();
      // }
    },
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    handleCheck(rule, value, callback) {
      if (value === undefined) {
        callback(new Error(' '))
      }
      if (/[^0-9a-zA-Z_]/.test(value)) {
        callback(new Error('不能有特殊字符'))
      }
      if (value && this.confirmDirty) {
        this.form.validateFields(['password2'], { force: true })
      }
      callback()
    },
    handlePasswordCheck(rule, value, callback) {
      const password = this.form.getFieldValue('password')
      // console.log('value', value)
      if (value === undefined) {
        callback(new Error(' '))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }

      callback()
    }
  }
}
</script>

<style scoped lang="less">
.handleLogin {
  color: rgba(62, 77, 168, 1);
  line-height: 56px;
}

.getCaptcha {
  width: 100%;
  text-align: right;
  display: inline-block;
  line-height: 56px;
  color: rgba(62, 77, 168, 1);
  &:hover {
    color: #60c697;
  }
}
</style>

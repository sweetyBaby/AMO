<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
      autocomplete="off"
      v-if="isLogin"
    >
      <h2 style="font-size: 22px; letter-spacing: 5px; font-weight: bold;">
        <img src="../../assets/logo_title.svg" style="width:38px;height:23px;paddingBottom:3px;" /> 翔云系统
      </h2>
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: '2px solid rgba(246, 246, 248, 1)' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" tab="账号密码登录">
          <a-form-item>
            <label for class="user-name">账号</label>
            <a-input
              size="large"
              type="text"
              placeholder="请输入账号/邮箱/手机号"
              v-decorator="[
                'account',
                {rules: [{ required: true, message: '请输入账号/邮箱/手机号' }], validateTrigger: 'change'}
              ]"
            >
              <!-- <a-input
              size="large"
              type="text"
              placeholder="请输入账号/邮箱/手机号"
              v-decorator="[
                'account',
                {rules: [{ required: true, message: '请输入账号/邮箱/手机号' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
              >-->
              <a-icon slot="suffix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <label for class="user-name">密码</label>
            <a-input
              size="large"
              :type="isPsw ? 'password' : 'text'"
              placeholder="请输入密码"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
            >
              <i
                style="font-size:22px"
                slot="suffix"
                :class="isPsw ? pswHide :pswShow"
                @click=" () => { isPsw = !isPsw } "
              ></i>
            </a-input>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="tab2" tab="手机号登录">
          <a-form-item>
            <label for class="user-name">手机号</label>
            <a-input
              size="large"
              type="text"
              placeholder="请输入手机号"
              v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]"
            >
              <a-icon slot="suffix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>
          <a-row :gutter="16" type="flex" align="middle">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <label for class="user-name">验证码</label>
                <a-input
                  size="large"
                  type="text"
                  placeholder="请输入验证码"
                  v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
              ></a>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
      <a-form-item style="margin-top:24px; text-align: center;" class="noborder">
        <a-row :gutter="24">
          <a-col :span="12">
            <a class="forge-password" @click="handlePswBack">忘记密码？</a>
          </a-col>
          <a-col :span="12" style="padding-right:12px;">
            <a-button
              size="large"
              htmlType="submit"
              class="login-button"
              :loading="state.loginBtn"
              :disabled="state.loginBtn"
            >确定</a-button>
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>
    <div class="Retrieve" v-else>
      <retrieve @handleLogin="handleBack" />
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import Retrieve from './modules/Retrieve'
import { getSmsCaptcha } from '@/api/login'

export default {
  components: {
    Retrieve
  },
  data() {
    return {
      errMsg: '',
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      },
      isLogin: true,
      pswShow: 'iconfont icon-openPsw',
      pswHide: 'iconfont icon-missPsw',
      isPsw: 'password'
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout', 'LoginPhone']),
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      //   const { state } = this;
      //   const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      //   if (regex.test(value)) {
      //     state.loginType = 0;
      //   } else {
      //     state.loginType = 1;
      //   }
      //   callback();
    },
    handleTabClick(key) {
      console.log(key)
      this.customActiveKey = key
      //   this.form.setFieldsValue({
      //     account: "",
      //     password: ""
      //   });

      // this.form.resetFields()
    },

    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login,
        LoginPhone
      } = this
      state.loginBtn = true

      const validateFieldsKey =
        customActiveKey === 'tab1'
          ? ['account', 'password']
          : ['mobile', 'captcha']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          if (customActiveKey === 'tab1') {
            const loginParams = { ...values }
            delete loginParams.account
            // loginParams[!state.loginType ? "email" : "account"] =
            //   values.account;
            loginParams.account = values.account
            loginParams.password = values.password
            Login(loginParams)
              .then(res => {
                this.loginSuccess(res)
              })
              .catch(err => this.requestFailed(err))
              .finally(() => {
                state.loginBtn = false
              })
          } else if (customActiveKey === 'tab2') {
            const loginParams = {
              account: values.mobile,
              password: values.captcha
            }
            LoginPhone(loginParams)
              .then(res => {
                this.loginSuccess(res)
              })
              .catch(err => this.requestFailed(err))
              .finally(() => {
                state.loginBtn = false
              })
          }
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    getCaptcha(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        LoginPhone
      } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          // const interval = window.setInterval(() => {
          //   if (state.time-- <= 0) {
          //     state.time = 60;
          //     state.smsSendBtn = false;
          //     window.clearInterval(interval);
          //   }
          // }, 1000);

          const hide = this.$message.loading('验证码发送中..', 0)
          const params = {
            mobile: values.mobile,
            type: 'login'
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
    stepCaptchaSuccess() {
      this.loginSuccess()
    },
    stepCaptchaCancel() {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess(res) {
      console.log(res)
      // console.log(this.$store);
      //   if (this.errMsg != "error"&&res !=='login') {
      //     // 延迟 1 秒显示欢迎信息
      //     setTimeout(() => {
      //       this.$notification.success({
      //         message:  ` ${this.$store.state.user.info.userName} ${timeFix()}`,
      //         description: `欢迎来到强生全视翔云系统`
      //       });
      //     }, 1000);
      //   }
      this.$router.push({ path: '/dashboard/home/homePage' })
    },
    requestFailed(err) {
      console.log(err)
      this.errMsg = err.type
      this.$notification['error']({
        message: '错误',
        description:
          err.msg ||
          ((err.response || {}).data || {}).msg ||
          '请求出现错误，请稍后再试',
        duration: 4
      })
    },
    handlePswBack() {
      this.isLogin = false
    },
    handleBack() {
      this.isLogin = true
    }
  }
}
</script>

<style lang="less">
.user-layout-login {
  padding: 52px 40px 12px 40px;
  box-sizing: border-box;
  min-height: 510px;
  background: white;
  box-shadow: 0px 10px 40px rgba(172, 173, 183, 0.6);
  border-radius: 16px;
  a {
    color: rgba(62, 77, 168, 1);
    &:hover {
      color: #60C697;
    }
  }
  label {
    font-size: 14px;
  }
  h2 {
    color: rgba(62, 77, 168, 1);
    font-size: 24px;
    text-align: center;
    margin: 0;
    padding: 0 0 64px 0;
  }

  .forge-password {
    font-size: 14px;
    text-align: left;
    float: left;
  }

  button.login-button {
    font-size: 14px;
    height: 44px;
    width: 140px;
    display: inline-block;
    margin: 0 auto;
    color: white;
    border-radius: 4px;
    background: rgba(243, 243, 249, 1);
    color: rgba(62, 77, 168, 1);
    border: none;
    float:right;
  }
  .login-button:hover {
    background: #3e4da8 !important;
    color: white;
  }

  .ant-form-item {
    // margin: 20px 0;
    label.user-name {
      font-size: 14px;
      color: rgba(147, 147, 147, 1);
      line-height: 19px;
      display: inline-block;
    }
    label.ant-checkbox-wrapper {
      span {
        font-size: 14px;
        color: rgba(141, 156, 176, 1);
      }
      .forge-password {
        color: rgba(62, 77, 168, 1);
      }
    }
  }
  .ant-form-item-children {
    display: inline-block;
    width: 100%;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
    position: relative;
    box-sizing: border-box;
    padding: 0 0 0 56px;
    height: 58px;
    .ant-input-affix-wrapper {
      width: 100%;
      .ant-input {
        height: 56px;
        line-height: 56px;
      }
      .iconfont {
        color: rgba(233, 233, 233, 1);
      }
    }
    .ant-input {
      height: 56px;
      line-height: 56px;
    }
    label.user-name {
      position: absolute;
      left: 0;
      top: 20px;
    }
  }
  .noborder {
    .ant-form-item-children {
      border: none;
      padding: 0;
    }
  }
  .ant-input-affix-wrapper {
    border: none;
    line-height: 32px;
    font-size: 16px;
    font-weight: bold;
    color: rgba(84, 97, 130, 1);
    background: white;
    display: inline-block;
  }
  .ant-input {
    border: none;
    background: white;
    line-height: 32px;
    padding:4px;
    min-height: 32px;
    color: rgba(84, 97, 130, 1);
    font-size: 14px;
    font-weight: bold;
    &:not(:first-child) {
      background: white;
    }
    &::-webkit-input-placeholder {
      color: rgba(147, 147, 147, 1);
      font-weight: bold;
    }
    &:-moz-placeholder {
      color: rgba(147, 147, 147, 1);
      font-weight: bold;
    }
    &::-moz-placeholder {
      color: rgba(147, 147, 147, 1);
      font-weight: bold;
    }
    &:-ms-input-placeholder {
      color: rgba(147, 147, 147, 1);
      font-weight: bold;
    }
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
  .ant-tabs-bar {
    margin: 0 0 20px 0;
    .ant-tabs-nav {
      width: 100%;
      border-bottom: 1px solid rgba(246, 246, 248, 1);
      .ant-tabs-tab {
        width: 50%;
        margin: 0;
        padding: 0 0 14px 0;
        color: rgba(147, 147, 147, 1);
        font-size: 14px;
        &.ant-tabs-tab-active {
          color: rgba(62, 77, 168, 1);
        }
      }
      .ant-tabs-ink-bar-animated {
        bottom: 0;
        background-color: rgba(62, 77, 168, 1);
        width: 50% !important;
        height: 2px;
      }
    }
  }
}

.getCaptcha {
  text-align: right;
  display: inline-block;
  line-height: 56px;
  color: rgba(62, 77, 168, 1);
  &:hover {
    color: rgba(17, 31, 122, 1);
  }
}
</style>

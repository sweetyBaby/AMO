<template>
  <a-form
    class="user-layout-login"
    :form="form"
    @submit="handleSubmit"
    autocomplete="off"
  >
    <h2>重置密码</h2>
    <a-popover placement="rightTop" trigger="click" :visible="state.passwordLevelChecked">
      <template slot="content">
        <div :style="{ width: '240px' }" >
          <div :class="['user-register', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span></div>
          <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor " />
          <div style="margin-top: 10px;">
            <span>请输入6-20个数字、字母、特殊字符组成的密码(区分大小写)。</span>
          </div>
        </div>
      </template>
      <a-form-item>
        <label for="" class="user-name">新密码</label>
        <a-input
          size="large"
          :type=" pswStatus1 ? 'text' : 'password' "
          @click="handlePasswordInputClick"
          autocomplete="false"
          placeholder="至少6位密码，区分大小写"
          v-decorator="['password', {rules: [{ required: true, message: '至少6位密码，区分大小写'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
        >
          <i slot="suffix" :class=" pswStatus1 ? 'iconfont icon-psw-see' : 'iconfont icon-psw-unsee' " :style="{ color: 'rgba(0,0,0,.25)' }" @click=" pswStatus1 = !pswStatus1"/>
        </a-input>
      </a-form-item>
    </a-popover>
    <!--<a-form-item  style="margin-top:0;" class="noborder">-->
    <!--<a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor " />-->
    <!--</a-form-item>-->
    <a-form-item>
      <label for="" class="user-name">确认密码</label>
      <a-input
        size="large"
        :type=" pswStatus2 ? 'text' : 'password' "
        autocomplete="false"
        placeholder="确认密码"
        v-decorator="['password2', {rules: [{ required: true, message: '6-20位密码，区分大小写' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
      >
        <i slot="suffix" :class=" pswStatus2 ? 'iconfont icon-psw-see' : 'iconfont icon-psw-unsee' " :style="{ color: 'rgba(0,0,0,.25)' }" @click=" pswStatus2 = !pswStatus2" />
      </a-input>
    </a-form-item>
    <a-form-item class="noborder">
      <!--<a class="forge-password" style="float:right"  @click="handleLogin">返回登陆</a>-->
    </a-form-item>
    <a-form-item style="margin-top:24px; text-align: center;" class="noborder">
      <a-button
        size="large"
        type="primary"
        htmlType="submit"
        class="login-button"
      >确认</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import { getSmsCaptcha } from '@/api/login'
import { getAuthCode, resetByMobile } from '@/api/auth'
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
  name: 'ModifyPsw',
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mixins: [mixinDevice],
  props: ['mobile'],
  data () {
    return {
      form: this.$form.createForm(this),
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      registerBtn: false,
      pswStatus1: false,
      pswStatus2: false
    }
  },
  computed: {
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    handlePasswordLevel (rule, value, callback) {
      let level = 0

      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++
      }
      this.state.passwordLevel = level
      this.state.percent = level * 30
      if (level >= 2) {
        if (level >= 3) {
          this.state.percent = 100
        }
        callback()
      } else {
        if (level === 0) {
          this.state.percent = 10
        }
        callback()
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      const _that = this
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (this.mobile !== '') {
            const params = {
              mobile: _that.mobile,
              password: values.password
            }
            console.info('params', params)
            resetByMobile(params).then(res => {
              if (res.message === 'SUCCESS') {
                console.info('newPSW----', res)
                window.location = '/user/login'
              } else {
                notification.error({
                  message: '错误提示',
                  description: res.message || '重置密码失败'
                })
              }
            })
          }
        }
      })
    },
    handlePasswordInputClick () {
      if (!this.isMobile()) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },
    handlePasswordCheck (rule, value, callback) {
      const password = this.form.getFieldValue('password')
      // console.log('value', value)
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    }
  }
  // watch: {
  //   'state.passwordLevel' (val) {
  //     console.log(val)
  //   }
  // }
}
</script>

<style scoped lang="less">
  .iconfont{
    font-size: 32px;
  }
  .ant-input-affix-wrapper .ant-input-suffix{
    right: 0;
  }
  .getCaptcha{
    width: 100%;
    text-align: right;
    display: inline-block;
  }
</style>

<template>
  <a-modal
    title="修改密码"
    class="modifyPsw"
    :width="640"
    :visible="visibleData"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :destroyOnClose="true"
    :closable="false"
    :footer="modalFooter"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <a-form :form="form">
        <p>注：检测到您的密码为初始密码，请修改密码。</p>
        <div class="addInput">
          <div class="addInput-title">
            <span>新密码</span>
            <small class="addInput-tips">6-20个数字、字母、特殊字符</small>
          </div>
          <div class="adInput-input">
            <a-form-item>
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
          </div>
        </div>
        <div class="addInput">
          <div class="addInput-title">
            <span> 确认密码</span>
            <small>必填</small>
          </div>
          <div class="adInput-input">
            <a-form-item>
              <a-input
                size="large"
                :type=" pswStatus2 ? 'text' : 'password' "
                autocomplete="false"
                placeholder="确认密码"
                v-decorator="['password2', {rules: [{ required: true, message: '至少6位密码，区分大小写' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
              >
                <i slot="suffix" :class=" pswStatus2 ? 'iconfont icon-psw-see' : 'iconfont icon-psw-unsee' " :style="{ color: 'rgba(0,0,0,.25)' }" @click=" pswStatus2 = !pswStatus2" />
              </a-input>
            </a-form-item>
          </div>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
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
  name: 'FirstLogin',
  props: ['visibleData'],
  data () {
    return {
      form: this.$form.createForm(this),
      confirmLoading: false,
      modalFooter: () => {
        return (
          <button type="primary" onClick={(e) => { this.handleSubmit(e) }} className="ant-btn ant-btn-primary"><span>提 交</span></button>
        )
      },
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
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
    },

    handlePhoneCheck (rule, value, callback) {
      callback()
    },

    handlePasswordInputClick () {
      this.state.passwordLevelChecked = false
    },
    handleSubmit (e) {
      e.preventDefault()
      const _that = this
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.info('values', values)
          _that.$emit('submit', values)
        }
      })
    },
    handleCancel () {
      console.info('2222')
    }
  }
}
</script>

<style lang="less">
  .ant-input-affix-wrapper .ant-input-suffix{
    right: 8px;
  }
  .getCaptcha{
    width: 100%;
    text-align: right;
    display: inline-block;
  }
  .modifyPsw .ant-modal-content .ant-modal-footer button{
    width: 100% !important;
    &:last-child{
      border-radius: 0 0 15px 15px !important;
      color: rgba(66, 131, 255, 1);
      border: none;
    }
  }
  .modifyPsw .addInput{
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
  .modifyPsw .adInput-input{
    .ant-select-selection--single{
      height: 54px;
    }
    .ant-select-selection__rendered{
      line-height: 54px;
    }
    .ant-form-item,.ant-form-item-control-wrapper,.ant-form-item-control{
      width: 100%;
    }
    .ant-input-affix-wrapper{
      .ant-input{
        height: 54px;
        width: 100%;
        line-height: 54px;
        background:rgba(247,250,255,1);
        border:1px solid rgba(205,223,252,1);
      }
    }
    .ant-input-affix-wrapper .ant-input-suffix{
      .icon-cancle{
        color: rgba(205, 223, 252, 1);
        font-size: 24px;
      }
    }
    .iconfont{
      font-size: 32px;
    }
  }
  .ant-modal-content {
    .ant-modal-body{
      .modal-info{
        .ant-spin-container{
          .ant-row{
            & > div{
              padding: 0 8px;
              border:none;
            }
          }
        }
      }
    }
  }
</style>

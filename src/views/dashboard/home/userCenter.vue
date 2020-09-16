<template>
  <a-card :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>个人中心</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleSubmit">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>保存</span>
                </template>
                <i class="iconfont icon-save"></i>
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
      <a-form layout="inline" :form="form">
        <a-row :gutter="16">
          <a-col :md="12" :sm="24">
            <div class="proNewBorder">
              <div class="proNew-title">
                <i class="iconfont icon-infor" />
                <span>用户基本信息</span>
              </div>
              <div class="addInput">
                <div class="addInput-title">
                  <span>用户名</span>
                </div>
                <div class="adInput-input">
                  <a-form-item
                    style="width: 100%"
                  >
                    <a-input
                      v-decorator="['account', { rules: [{ required: false, whitespace: true }]}]"
                      style="width: 100%"
                      disabled
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="addInput">
                <div class="addInput-title">
                  <span>真实姓名</span>
                </div>
                <div class="adInput-input">
                  <a-form-item style="width: 100%" has-feedback >
                    <a-input
                      v-decorator="['userName', { rules: [{ required: false, message: '请输入真实姓名！', whitespace: true }]}]"
                      style="width: 100%"
                      placeholder="请输入真实姓名"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="addInput">
                <div class="addInput-title">
                  <span>邮箱</span>
                </div>
                <div class="adInput-input">
                  <a-form-item has-feedback >
                    <a-input
                      v-decorator="['email',{rules: [
                        { type: 'email', required: false, message: '输入邮箱格式不对！'},
                        { required: false }]}]"
                      placeholder="请输入邮箱"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="addInput">
                <div class="addInput-title">
                  <span>所属机构</span>
                </div>
                <div class="adInput-input">
                  <a-form-item has-feedback >
                    <a-input
                      v-decorator="['orgCode', { rules: [{ required: false }]}]"
                      placeholder="请输入所属机构"
                      disabled
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="addInput">
                <div class="addInput-title">
                  <span>职位</span>
                </div>
                <div class="adInput-input">
                  <a-form-item >
                    <a-radio-group
                      name="radioGroup"
                      @change="handlePosition"
                      v-decorator="['position', { rules: [{ required: false }]}]"
                    >
                      <a-radio value="storage">仓储</a-radio>
                      <a-radio value="purchase">采购</a-radio>
                      <a-radio value="sale">销售</a-radio>
                      <a-radio value="others">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </div>
              </div>
            </div>
          </a-col>
          <a-col :md="12" :sm="24">
            <div class="proNewBorder">
              <div class="proNew-title">
                <i class="iconfont icon-userCard" />
                <span>账户安全</span>
              </div>
              <div class="addInput">
                <div class="addInput-title">
                  <span>手机号绑定</span>
                  <small><a @click="handleModal">{{ mobile ? '点击改绑' : '点击绑定' }}</a></small>
                </div>
                <div class="adInput-input">
                  <a-form-item
                    style="width: 100%"
                  >
                    <a-input
                      v-decorator="['mobile', { rules: [{ required: false, whitespace: true }]}]"
                      size="large"
                      disabled
                    />
                  </a-form-item>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <modify-psw
      :visibleData="pswData"
      @submit="handlePsw"
    />
  </a-card>
</template>

<script>
import { getAccount, checkAccount, modifyUserInfo } from '@/api/auth'
import notification from 'ant-design-vue/es/notification'
import ModifyPsw from './modules/ModifyPsw'
export default {
  name: 'UserCenter',
  components: { ModifyPsw },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.userDatas = this.$store.getters.userInfo
    this.form.setFieldsValue({
      account: this.userDatas.account,
      userName: this.userDatas.userName,
      mobile: this.userDatas.mobile,
      email: this.userDatas.email,
      orgCode: this.userDatas.orgCode,
      position: this.userDatas.position
    })
    this.mobile = this.userDatas.mobile
    this.userId = this.userDatas.id
  },
  data () {
    // console.info('this.userData',this.userData)
    return {
      userDatas: [],
      mobile: '',
      pswData: {}
    }
  },
  methods: {
    handleChange (val) {
      console.info('val---', val)
    },
    handleSubmit  (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const params = values
          params.id = this.userId
          console.info('params----', params)
          modifyUserInfo(params).then(res => {
            // console.info('已提交',res)
            if (res.message === 'SUCCESS') {
              notification.success({
                message: '修改成功',
                description: '个人信息修改成功',
              })
              this.$router.push({ path: '/dashboard/home/homePage' })
            }
          })
        }
      })
    },
    handlePosition (e) {
      this.form.setFieldsValue({
        position: e.target.value
      })
    },
    handleModal () {
      this.pswData = {
        isModify: true,
        userId: this.userId
      }
    },
    handlePsw (val) {
      if (val.mobile) {
        this.mobile = val.mobile
        this.form.setFieldsValue({
          mobile: val.mobile
        })
      }
      this.pswData = {
        isModify: false,
        userId: this.userId
      }
    }
  },
}
</script>
<style lang="less">
  //新增页面边框
  .proNewBorder{
    margin: 16px 0 0 0;
    width: 100%;
    border:1px solid rgba(219,231,253,1);
    padding: 48px;
    .proNew-title{
      color: rgba(84, 97, 130, 1);
      font-size: 16px;
      height: 36px;
      width: 100%;
      display: inline-block;
      .iconfont{
        color: rgba(66, 131, 255, 1);
        font-size: 26px;
      }
      span{
        float: left;
        line-height: 36px;
        font-size: 16px;
      }
    }
    .addInput{
      margin: 36px 0 0 0;
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
    .adInput-input{
      .ant-select-selection--single{
        height: 54px;
      }
      .ant-select-selection__rendered{
        line-height: 54px;
      }
      .ant-form-item,.ant-form-item-control-wrapper,.ant-form-item-control{
        width: 100%;
      }
      .ant-input{
        height: 54px;
        width: 100%;
        line-height: 54px;
        background:rgba(247,250,255,1);
        border:1px solid rgba(205,223,252,1);
      }
      .ant-btn{
        height: 54px;
        line-height: 54px;
      }
      .ant-input-affix-wrapper{
        border:none;
        .ant-input-suffix{
          .icon-cancle{
            color: rgba(205, 223, 252, 1);
            font-size: 24px;
          }
        }
      }
      /*.has-error{*/
      /*.ant-input{*/
      /*border-color: #f5222d;*/
      /*}*/
      /*}*/
    }
    .addInput-tag{
      padding: 24px 0;
      .ant-tag{
        width:168px;
        height:36px;
        background:rgba(247,250,255,1);
        border:1px solid rgba(205,223,252,1);
        border-radius:4px;
        line-height: 36px;
        color: rgba(159, 172, 195, 1);
        font-size: 14px;
        padding: 0 12px;
        display: inline-block;
        margin: 0 8px 16px 0;
        .anticon{
          float: right;
          line-height: 36px;
          color: rgba(205, 223, 252, 1);
          font-size: 16px;
        }
        &:hover,&:active{
          background: rgba(229, 238, 255, 1);
          border-color: rgba(176, 204, 255, 1);
          color: rgba(66, 131, 255, 1);
          font-weight: bold;
          .anticon{
            color: rgba(66, 131, 255, 1);
            font-weight: bold;
          }
        }
      }
    }
  }

  .ant-form-inline .ant-form-item-with-help{
    margin: 0 ;
  }

  .upload{
    padding: 0 0 24px 0;
  }
  /* tile uploaded pictures */
  .ant-upload-list{
    float: left;
    width: auto;
  }
  .ant-upload-list > .ant-upload-list-item {
    float: left;
    width: 168px;
    height: auto;
    display: inline-block;
    background:rgba(249,251,255,1);
    border:1px solid rgba(205,223,252,1);
    border-radius:4px;
    margin-right: 8px;
    padding: 8px;
    .ant-upload-list-item-info{
      > span{
        width: 100%;
        text-align: center;
        display: inline-block;
        height: 100%;
        padding: 0;
        margin: 0;
        min-height: 162px;
        a:first-child{
          width: 100px;
          height: 100px;
          top: auto;
          left: auto;
          position: relative;
          display: inline-block;
          margin: 8px 0 0 0;
          img{
            width: 100px;
            height: 100px;
          }
          .anticon{
            font-size: 48px;
            padding: 26px 0;
            color: rgba(205, 223, 252, 1);
          }
        }
      }
      .ant-upload-list-item-name{
        padding: 0;
        min-height: 44px;
      }
    }
    .anticon-close{
      font-size: 16px;
      color: rgba(205, 223, 252, 1);
      opacity: 1;
    }
  }
  .ant-upload-list > .ant-upload-animate-enter {
    animation-name: uploadAnimateInlineIn;
  }
  .ant-upload-list > .ant-upload-animate-leave {
    animation-name: uploadAnimateInlineOut;
  }

  .ant-upload.ant-upload-drag {
    border: none;
    background: none;
    text-align: left;
    /*float: left;*/
    width: auto;
    display: inline-block;
    .ant-upload{
      padding: 0;
    }
    .ant-upload-list{
      width:168px;
      min-height: 180px;
      margin: 0 16px 0 0;
      > .ant-upload-list-item {
        height: 100%;
        min-height: 180px;
      }
    }

  }
</style>

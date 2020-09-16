<template>
  <a-card :bordered="false">
    <a-spin :spinning="spinning">
      <div class="pageTitle">
        <a-row :gutter="24">
          <a-col :md="16" :sm="24">
            <h3 style="display:inline-block">个人中心</h3>
            <a @click="updatePassword" class="pasward">
              <i class="iconfont icon-table-edit" />修改密码
            </a>
          </a-col>
          <a-col :md="8" :sm="24">
            <div class="icons-list pageTitle-Btn">
              <span class="titleBtn" @click="handleBack()">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>返回</span>
                  </template>
                  <i class="iconfont icon-back"></i>
                </a-tooltip>
              </span>
              <span class="titleBtn" @click="handleSubmit">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>保存</span>
                  </template>
                  <i class="iconfont icon-save"></i>
                </a-tooltip>
              </span>
              <!-- <span class="titleBtn">
                                <a-tooltip placement="top">
                                    <template slot="title">
                                        <span>取消</span>
                                    </template>
                                    <i class="iconfont icon-cancle"></i>
                                </a-tooltip>
              </span>-->
            </div>
          </a-col>
        </a-row>
      </div>
      <div>
        <a-form layout="inline" :form="form">
          <a-row :gutter="16">
            <a-col :md="8" :sm="12">
              <div class="proNewBorder">
                <div class="addInput ban_update">
                  <div class="addInput-title">
                    <small class="ban_small">不可修改</small>
                    <span>用户名</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input
                        disabled
                        v-decorator="['userName', { rules: [{ required: false, message: '输入用户名', whitespace: true }]}]"
                        placeholder="输入用户名"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </div>
                </div>
                <div class="addInput">
                  <div class="addInput-title">
                    <small>*</small>
                    <span>真实姓名</span>
                  </div>
                  <div class="adInput-input">
                    <div style="margin-bottom: 16px">
                      <a-form-item style="width: 100%" has-feedback>
                        <a-input
                          v-decorator="['nickName', { rules: [{ required: true, message: '请输入真实姓名！', whitespace: true }]}]"
                          placeholder="请输入真实姓名"
                          style="width: 100%"
                        />
                      </a-form-item>
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
            <a-col :md="8" :sm="12">
              <div class="proNewBorder">
                <div class="addInput">
                  <div class="addInput-title">
                    <small>*</small>
                    <span>邮箱</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input
                        v-decorator="['email', { rules: [{ required: true,pattern:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '请输入正确的邮箱！', whitespace: true }]}]"
                        placeholder="输入邮箱"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </div>
                </div>
                <div class="addInput ban_update">
                  <div class="addInput-title">
                    <!-- <small class="ban_small">不可修改</small> -->
                    <span>手机号</span>
                  </div>
                  <div class="adInput-input changePhon">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input
                        disabled
                        v-decorator="['mobile', { rules: [{ required: false, message: '输入手机号', whitespace: true }]}]"
                        placeholder="输入手机号"
                        style="width: 60%"
                      />
                      <a-button @click="showModalPhone">更换手机</a-button>
                    </a-form-item>
                  </div>
                </div>
              </div>
            </a-col>
            <a-col :md="8" :sm="12">
              <div class="proNewBorder">
                <div class="addInput ban_update">
                  <div class="addInput-title">
                    <small class="ban_small">不可修改</small>
                    <span>经销商代码</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input
                        disabled
                        v-decorator="['distCode', { rules: [{ required: false, message: '请输入经销商代码！', whitespace: true }]}]"
                        placeholder="请输入经销商代码"
                        style="width: 100%"
                      />
                      <!-- <a-select
                      mode="multiple"
                      :defaultValue="['a1', 'b2']"
                      style="width: 100%"
                      @change="handleChange"
                      placeholder="Please select"
                    >
                      <a-select-option
                        v-for="i in 25"
                        :key="(i + 9).toString(36) + i"
                      >{{(i + 9).toString(36) + i}}</a-select-option>
                      </a-select>-->
                    </a-form-item>
                  </div>
                </div>
                <div class="addInput ban_update">
                  <div class="addInput-title">
                    <small class="ban_small">不可修改</small>
                    <span>经销商名称</span>
                  </div>
                  <div class="adInput-input">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-input
                        disabled
                        v-decorator="['distName', { rules: [{ required: false, message: '请输入经销商代码！', whitespace: true }]}]"
                        placeholder="请输入经销商代码"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-form>
        <change-phone ref="phoneCode" @PostNewPhone="getNewPhone" />
        <change-password ref="passCode" />
      </div>
    </a-spin>
  </a-card>
</template>
<script>
import { retrivePersonal, updatePerson } from '@/api/information'
import ChangePhone from './modules/ChangePhone'
import ChangePassword from './modules/ChangePassword'
import { notification } from 'ant-design-vue'
export default {
  name: 'PersonalCenterData',
  components: { ChangePhone, ChangePassword },
  data() {
    return {
      addBtn: true,
      spinning: true,
      formData: {}
    }
  },
  // 创建前的生命周期
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    this.getTableList()
    // console.log(  this.$store.state.user.info.mobile);
  },
  mounted() {},
  methods: {
    handleSubmit(e) {
      if (this.addBtn) {
        e.preventDefault()
        let params = {}
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.addBtn = false
            this.spinning = true
            params = {
              nickName: values.nickName,
              email: values.email
            }
            this.updateDetails(params)
          }
        })
      }
    },
    updateDetails(params) {
      console.log(params)
      updatePerson(params).then(res => {
        this.spinning = false
        if (res.message === 'SUCCESS') {
          this.addBtn = true
          this.getTableList()
          notification.success({
            message: '修改成功'
          })
          // this.$store.state.user.info.userName=params.userName;
        } else {
          this.addBtn = true
          notification.error({
            message: '错误',
            description: res.message
          })
        }
      })
    },
    getTableList() {
      retrivePersonal().then(res => {
        if (res.message === 'SUCCESS') {
          this.spinning = false
          this.formData = res.data
          this.form.setFieldsValue({
            nickName: this.formData.nickName,
            userName: this.formData.userName,
            email: this.formData.email,
            mobile: this.formData.mobile,
            distName: this.formData.distName,
            distCode: this.formData.distCode
          })
        }
      })
    },
    updatePassword() {
      this.$refs.passCode.showPass(this.formData.sysUserCode)
    },
    showModalPhone() {
      this.$refs.phoneCode.showphone(this.formData.sysUserCode)
    },

    getNewPhone(val) {
      this.form.setFieldsValue({
        mobile: val
      })
    },
    handleBack() {
      this.$router.push('/dashboard/home/homePage')
    }
  }
}
</script>
<style lang="less">
// 弹框
.ant-modal {
  .bounced {
    .addInput {
      margin-top: 30px;
      .addInput-title {
        margin-bottom: 9px;
        span {
          color: #9c9c9e;
          margin-left: 10px;
        }
        small {
          color: #e17877;
        }
      }
      .adInput-input {
        .ant-btn {
          height: 44px;
          border-radius: 4px;
          background: #fbfbfb;
          border: 0;
          margin-left: 10px;
          float: right;
          //   width: 30%;
          color: #3e4da8;
        }

        .ant-btn:hover {
          background: #ececec !important;
        }

        .ant-form-item-control-wrapper {
          width: 100%;
          .ant-input {
            height: 44px;
            background: rgba(252, 252, 252, 1);
            border: 1px solid rgba(236, 236, 236, 1);
            opacity: 1;
            border-radius: 4px;
          }
        }
        .has-feedback {
          width: 100%;
        }
      }
    }
  }
}

/* //新增页面边框 */

.proNewBorder {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 20px rgba(172, 173, 183, 0.2);
  opacity: 1;
  border-radius: 4px;
  padding: 30px 40px;
  margin-top: 20px;

  .proNew-title {
    color: rgba(84, 97, 130, 1);
    font-size: 14px;
    height: 36px;
    width: 100%;
    display: inline-block;

    .iconfont {
      color: rgba(66, 131, 255, 1);
      font-size: 26px;
    }

    span {
      float: left;
      line-height: 36px;
      font-size: 16px;
    }
  }

  /* 不可修改时的样式 */
  .ban_update {
    .addInput-title {
      .ban_small {
        float: right;
        color: rgba(62, 77, 168, 1) !important;
        opacity: 1;
      }
    }

    .changePhon {
      .ant-btn {
        height: 44px;
        border-radius: 4px;
        background: #fbfbfb;
        border: 0;
        // margin-left: 10px;
        float: right;
        width: 30%;
        color: #3e4da8;
      }

      .ant-btn:hover {
        background: #ececec !important;
      }
    }

    .adInput-input {
      .ant-input {
        background: rgba(236, 236, 236, 1) !important;
        color: rgba(193, 193, 193, 1) !important;
        opacity: 1 !important;
      }
    }
  }

  .addInput {
    margin-bottom: 30px;

    .addInput-title {
      padding: 0 0 8px 0;
      font-size: 14px;

      span {
        color: rgba(84, 97, 130, 1);
      }

      small {
        color: #e17877;
        margin-right: 5px;
        float: left;

        &.addInput-tips {
          color: rgba(170, 174, 185, 1);
        }
      }
    }
  }

  .adInput-input {
    .ant-calendar-picker {
      max-width: 100% !important;
    }

    .begin_date {
      .anticon-calendar {
        color: #3e4da8;
      }
    }

    .ant-select-selection--single {
      height: 42px;
    }

    .ant-select-selection__rendered {
      line-height: 42px;
    }

    .ant-form-item,
    .ant-form-item-control-wrapper,
    .ant-form-item-control {
      width: 100%;
    }

    .ant-select-selection {
      background: rgba(252, 252, 252, 1) !important;
      border: 1px solid #ececec !important;
    }

    .ant-input {
      width: 100%;
      height: 44px;
      background: rgba(252, 252, 252, 1);
      border: 1px solid rgba(236, 236, 236, 1);
      opacity: 1;
      border-radius: 4px;
    }

    .ant-input-affix-wrapper .ant-input-suffix {
      .icon-cancle {
        color: rgba(205, 223, 252, 1);
        font-size: 24px;
      }
    }
  }

  /* 城市2级联动样式 */
  .area-select-wrap {
    display: flex;
    flex-wrap: nowrap;

    .area-select {
      background: #fcfcfc;
      border: 1px solid #ececec;
      color: rgba(159, 172, 195, 1);
      height: 42px;
      width: 50%;
      line-height: 42px;
      display: inline-block;
      position: relative;

      .area-select-icon {
        font-family: "iconfont";
        font-style: normal;
        position: absolute;
        right: 16px;
        top: 0;

        &:before {
          content: "\e64b";
        }
      }

      &:first-child {
        margin-left: 0;
      }

      .area-selected-trigger {
        width: 100%;
        padding: 0 12px;
        display: inline-block;
      }

      .area-selectable-list-wrap {
        position: absolute;
        margin: -15px 0 0 0;
        width: 100%;
      }

      .area-selectable-list {
        border: 1px solid #ececec;
        width: 100%;
        margin: 12px 0 0 0;
        padding: 0;
        list-style: none;
        z-index: 9999;
        position: absolute;
        background: #fcfcfc;
        max-height: 130px;
        overflow-y: auto;

        li {
          padding: 0 12px;
          cursor: pointer;
          line-height: 32px;
        }
      }
    }
  }

  /* 上传图片 */
  .clearfix {
    .ant-upload-select-picture-card i {
      font-size: 32px;
      color: #999;
    }

    .ant-upload-select-picture-card {
      .ant-upload-text {
        margin-top: 8px;
        color: #666;
      }
    }

    .ant-upload-select-picture-card {
      width: 119px;
      height: 119px;

      .ant-upload-text {
        margin-top: 0px;
        color: #b6b3b3;
      }
    }

    .ant-upload-list-picture-card {
      /* width: 100%; */
      .ant-upload-list-item-error {
        border: 0;
      }

      .ant-upload-list-item {
        margin-right: 10px;
        margin-bottom: 10px;
        background: rgba(252, 252, 252, 1);
        border: 1px solid rgba(236, 236, 236, 1);
        opacity: 1;
        border-radius: 4px;
      }

      .ant-upload-list-item {
        width: 119px;
        height: 119px;

        padding: 0;
      }
    }
  }
}

/* 操作记录 */
.operation_records {
  margin-top: 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 20px rgba(172, 173, 183, 0.2);
  opacity: 1;
  border-radius: 8px;
  padding: 37px 35px 30px 40px;

  .operation_vertical {
    width: 1px;
    height: 21px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(236, 236, 236, 1);
    opacity: 1;
    margin-left: 13px;
    margin-bottom: 5px;
    margin-top: 5px;
  }

  .operation_btn {
    color: #3e4da8;
    text-align: center;
    line-height: 34px;
    display: block;
    width: 96px;
    height: 34px;
    background: rgba(246, 246, 246, 1);
    opacity: 1;
    border-radius: 22px;
  }

  .ant-steps {
    .ant-steps-item {
      height: 90px;

      .ant-steps-item-title {
        font-size: 14px;
        font-family: PingFang SC;
        color: rgba(52, 53, 62, 1);
        opacity: 1;
        margin-bottom: 10px;
      }
    }

    .ant-steps-icon {
      color: rgba(236, 236, 236, 1) !important;
    }
  }
}
.pasward {
  color: #3e4da8;
  margin-left: 24px;
  .icon-table-edit {
    font-size: 17px;
  }
}
.pasward:hover {
  color: #60c697;
}
</style>

<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>编辑用户</h3>
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
            <span class="titleBtn" @click="handleSubmitSave()">
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
    </div>
    <a-form layout="inline" :form="form">
      <a-row :gutter="16">
        <a-col :md="8" :sm="12">
          <div class="proNewBorder">
            <div class="addInput ban_update">
              <div class="addInput-title">
                <span>用户名</span>
                <small class="ban_small">不可修改</small>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    disabled
                    v-decorator="['userName', { rules: [{ required: false, message: '请输入用户名！', whitespace: true }]}]"
                    style="width: 100%"
                    placeholder="请输入用户名"
                    @blur="handleChangeName"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput ban_update">
              <div class="addInput-title">
                <span>真实姓名</span>
                <small class="ban_small">不可修改</small>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    disabled
                    v-decorator="['nickName', { rules: [{ required: false, message: '请输入真实姓名！', whitespace: true }]}]"
                    style="width: 100%"
                    placeholder="请输入真实姓名"
                    @blur="handleChangeName"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput ban_update">
              <div class="addInput-title">
                <span>手机号</span>
                <small class="ban_small">不可修改</small>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    disabled
                    v-decorator="['mobile', { rules: [
                      { pattern:/^1[3|4|5|7|8|9][0-9]\d{8}$/,message:'手机号码格式不正确'},
                      { required: false, whitespace: true }
                    ]}]"
                    style="width: 100%"
                    placeholder="请输入手机号"
                    :maxLength="11"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput ban_update">
              <div class="addInput-title">
                <span>邮箱</span>
                <small class="ban_small">不可修改</small>
              </div>
              <div class="adInput-input">
                <a-form-item has-feedback>
                  <a-input
                    disabled
                    v-decorator="['email',{rules: [
                      { type: 'email', message: '输入邮箱格式不对！'},
                      { required: false }]}]"
                    placeholder="请输入邮箱"
                  />
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
                <span>所属机构类型</span>
              </div>
              <div class="adInput-input">
                <a-form-item has-feedback>
                  <a-input
                    disabled
                    v-decorator="['sysOrgCode', { rules: [{ required: false, message: '输入所属机构', whitespace: true }]}]"
                    placeholder="请输入所属机构类型"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput ban_update">
              <div class="addInput-title">
                <small class="ban_small">不可修改</small>
                <span>机构名称</span>
              </div>
              <div class="adInput-input">
                <a-form-item has-feedback>
                  <a-input
                    disabled
                    v-decorator="['sysOrgName', { rules: [{ required: false }]}]"
                    placeholder="请输入机构名称"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <span>用户角色</span>
                <small>*</small>
              </div>
              <div class="adInput-input" @click="showRoleModal()">
                <a-form-item has-feedback>
                  <a-input style="width: 100%" placeholder="选择角色" :readOnly="true">
                    <i slot="suffix" class="iconfont icon-more" />
                  </a-input>
                </a-form-item>
              </div>
              <div class="addInput-tag">
                <template v-for="item in checkRole">
                  <a-tag
                    v-if="checkRole.length > 0"
                    :key="item.id"
                    closable
                    :afterClose="() => handleDelete(item.id)"
                  >{{ item.roleName }}</a-tag>
                </template>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :md="8" :sm="12">
          <div class="proNewBorder">
            <div class="addInput">
              <div class="addInput-title">
                <span>产品线权限</span>
                <small>*</small>
              </div>
              <div class="adInput-input" @click="showLineModal()">
                <a-form-item has-feedback>
                  <a-input style="width: 100%" placeholder="选择经产品线权" :readOnly="true">
                    <i slot="suffix" class="iconfont icon-more" />
                  </a-input>
                </a-form-item>
              </div>
              <div class="addInput-tag">
                <template v-for="item in checList">
                  <a-tag
                    v-if="checList.length > 0"
                    :key="item.id"
                    closable
                    :afterClose="() => ListClose(item.id)"
                  >{{ item.lineName }}</a-tag>
                </template>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <span>经销商权限</span>
                <small>*</small>
              </div>
              <div class="adInput-input" @click="showModal()">
                <a-form-item has-feedback>
                  <a-input style="width: 100%" placeholder="选择经销商" :readOnly="true">
                    <i slot="suffix" class="iconfont icon-more" />
                  </a-input>
                </a-form-item>
              </div>
              <div class="addInput-tag">
                <template v-for="item in checkDist">
                  <a-tag
                    v-if="checkDist.length > 0"
                    :key="item.id"
                    closable
                    :afterClose="() => handleClose(item.id)"
                  >{{ item.distName }}</a-tag>
                </template>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-form>
    <org-list-modal
      id="testModal"
      title="选择经销商"
      :visibleData="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :modalData="checkDist"
    />

    <role-select
      title="选择用户角色"
      :visibleData="visibleRole"
      @ok="handleChooseOk"
      @cancel="handleCancelRole"
      :modalData="checkRole"
    />
    <product-line-select
      title="产品线"
      :visibleData="visibleLine"
      @ok="handleLineOk"
      @cancel="LineCancel"
      :modalData="checList"
    />
  </div>
</template>

<script>
// import { getOrgName } from "@/api/storage";
import {
  getAccount,
  checkAccount,
  addUser,
  getUserCode,
  editUser
} from '@/api/auth'
import { DataFilter } from '@/utils/storage'
import OrgListModal from './modules/OrgListModal'
import RoleSelect from './modules/RoleSelect'
import ProductLineSelect from './modules/ProductLineSelect'
import notification from 'ant-design-vue/es/notification'
export default {
  name: 'AddNewPro',
  props: ['userData'],
  components: {
    OrgListModal,
    RoleSelect,
    ProductLineSelect
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  mounted() {
    if (this.userData.sysUserCode) {
      this.getUser(this.userData.sysUserCode)
      if (this.userData.sysOrgCode == 'SYS_INNOVAMED') {
        this.userData.sysOrgCode = '医迈德'
      } else if (this.userData.sysOrgCode == 'JJSV') {
        this.userData.sysOrgCode = '眼力健'
      } else if (this.userData.sysOrgCode == 'CRGD') {
        this.userData.sysOrgCode = '华润广东'
      } else {
        this.userData.sysOrgCode = '经销商'
      }
      this.isNewUser = false
      this.form.setFieldsValue({
        userName: this.userData.userName,
        nickName: this.userData.nickName,
        mobile: this.userData.mobile,
        email: this.userData.email,
        orgCode: this.userData.orgCode,
        sysOrgCode: this.userData.sysOrgCode,
        sysOrgName: this.userData.sysOrgName
      })
    }
  },
  data() {
    // console.info('this.userData',this.userData)
    return {
      addBtn: true,
      visibleLine: false,
      queryParam: {},
      lineTag: ['产品线1'],
      confirmDirty: false,
      distList: [],
      roleList: [],
      lineLinst: [],
      account: '',
      accountStatus: '',
      isChange: '',
      isError: false,
      visible: false,
      visibleRole: false,
      checList: [],
      checkDist: [],
      checkRole: [],
      isNewUser: true,
      userCode: '',
      position: 'storage',
      fileList: [],
      previewVisible: false,
      previewImage: ''
    }
  },
  methods: {
    showLineModal() {
      this.visibleLine = true
    },
    handleChange(val) {
      console.info('val---', val)
    },
    handleBack() {
      this.$emit('handleBack', false)
    },
    handleLineSel(val) {
      // console.info('val---',val);
      let inputVal
      this.prolistData.map(tag => {
        if (tag.id === val) {
          inputVal = tag.name
        }
      })
      let lineTag = this.lineTag
      if (inputVal && lineTag.indexOf(inputVal) === -1) {
        lineTag = [...lineTag, inputVal]
      }
      // console.log(lineTag)
      Object.assign(this, {
        lineTag
      })
    },
    ListClose(removed) {
      const tags = this.checList.filter(tag => tag.id !== removed)
      this.checList = tags
    },
    handleClose(removedTag) {
      const tags = this.checkDist.filter(tag => tag.id !== removedTag)
      this.checkDist = tags
      console.log('========', this.checkDist)
    },
    handleDelete(tagItem) {
      console.info('tagItem---', tagItem)
      const tags = this.checkRole.filter(tag => tag.id !== tagItem)
      this.checkRole = tags
      console.info(' this.checkRole----', this.checkRole)
    },

    handleSubmitSave(e) {
      if (this.addBtn) {
        // this.addBtn = false;
        // e.preventDefault();
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            const params = {}
            console.info(
              'this.userData.sysUserCode---',
              this.userData.sysUserCode
            )
            if (this.userData.sysUserCode) {
              params.sysUserCode = this.userData.sysUserCode
              if (
                this.checkDist.length > 0 &&
                this.checkRole.length > 0 &&
                this.checList.length > 0
              ) {
                params.roleList = this.checkRole
                params.distList = this.checkDist
                params.lineList = this.checList
                editUser(params).then(res => {
                  console.info('已提交', res)
                  if (res.message === 'SUCCESS') {
                    this.$emit('handleBack', false)
                  }
                })
              } else if (this.checkRole.length == 0) {
                notification.error({
                  message: '错误提示',
                  description: '用户角色不能为空！'
                })
              } else if (this.checList.length == 0) {
                notification.error({
                  message: '错误提示',
                  description: '产品线权限不能为空！'
                })
              } else if (this.checkDist.length == 0) {
                notification.error({
                  message: '错误提示',
                  description: '经销商权限,不能为空！'
                })
              }
            } else if (!this.isError || this.isChange === 'error') {
              notification.error({
                message: '错误提示',
                description: '请先校验账号是否唯一！'
              })
            } else if (
              this.checkDist.length > 0 &&
                this.checkRole.length > 0
            ) {
              params.roles = this.checkRole
              params.orgInfos = this.checkDist
              params.productLines = []
              params.qualification = this.upList2
              // console.info('params----',params)
              addUser(params).then(res => {
                // console.info('已提交',res)
                if (res.message === 'SUCCESS') {
                  this.$emit('handleBack', false)
                }
              })
            } else {
              notification.error({
                message: '错误提示',
                description: '赋予该用户角色或能查看经销商不能为空！'
              })
            }
            console.info('submit-values---', params)
          }
        })
      }
    },
    handleOk(values) {
      this.visible = false
      this.distList = values
      this.checkDist = values
    },
    handleChooseOk(lists) {
      this.visibleRole = false
      this.roleList = lists
      this.checkRole = lists
    },
    handleLineOk(lists) {
      this.visibleLine = false
      this.lineLinst = lists
      this.checList = lists
    },
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    onSearch(value) {
      const params = {}
      if (value !== '') {
        params.account = value
        if (this.userData.sysUserCode) {
          params.id = this.userData.sysUserCode
        }

        checkAccount(params).then(res => {
          if (res.message === 'SUCCESS') {
            this.isChange = 'success'
            this.isError = true
          } else {
            this.isChange = 'error'
            this.isError = true
          }
        })
      }
    },
    handleChangeName(val) {
      const params = {
        userName: val.target.value
      }
      getAccount(params).then(res => {
        this.form.setFieldsValue({
          account: res.data
        })
      })
    },
    showModal() {
      console.log(this.checkDist)
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    handleCancelRole() {
      this.visibleRole = false
    },
    LineCancel() {
      this.visibleLine = false
    },
    showRoleModal() {
      this.visibleRole = true
    },
    getUser(val) {
      const parmas = {
        sysUserCode: val
      }
      getUserCode(parmas).then(res => {
        if (res.message === 'SUCCESS') {
          const result = res.data
          this.checkRole = result.roleList
          this.checkDist = result.distList
          this.checList = result.lineList
        }
      })
    },
    handleInput(e) {
      console.info('console.info----', e)
      if (e.target.value.length > 11) {
        this.form.setFieldsValue({
          mobile: e.target.value.slice(0, 11)
        })
      }
    },
    handlePosition(e) {
      this.form.setFieldsValue({
        position: e.target.value
      })
    }
  }
}
</script>
<style lang="less">
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
      //   border: 1px solid rgba(236, 236, 236, 1);
      opacity: 1;
      border-radius: 4px;
    }
    .ant-input-affix-wrapper {
      border: 0;
    }
    .ant-input-affix-wrapper .ant-input-suffix {
      .icon-cancle {
        color: rgba(205, 223, 252, 1);
        font-size: 24px;
      }
    }
  }
  .addInput-tag {
    margin-top: 23px;
    .ant-tag {
      color: #3e4da8;
      margin-bottom: 5px;
    }
    .ant-tag:hover {
      .anticon-close {
        color: #3e4da8;
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
</style>

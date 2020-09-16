<template>
  <div class="page">
    <div class="pageTitle">
      <a-row :gutter="24">
        <a-col :md="16" :sm="24">
          <h3> 编辑开票名称 </h3>
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
          </div>
        </a-col>
      </a-row>
    </div>
    <a-form layout="inline" :form="form">
      <div class="proNewBorder">
        <a-row :gutter="24">
          <a-col :md="8">
            <div class="addInput">
              <div class="addInput-title">
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <small v-else>*</small>
                <span>客户名称</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    placeholder="请选择医院名称"
                    @click="handleSelectCus"
                    :style="{ width: '100%'}"
                    v-model="cusData.hosName"
                    :disabled="isEdit"
                  />
                </a-form-item>
              </div>
            </div>
          </a-col>
          <a-col :md="8">
            <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>可开票名称</span>
              </div>
              <div class="adInput-input">
                <div style="margin-bottom: 16px">
                  <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      v-model="cusData.mappingName"
                      placeholder="可开票名称"
                      style="width: 100%"
                      :maxLength="100"
                    />
                  </a-form-item>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>

      </div>
    </a-form>
    <!--     选择医院名称-->
    <select-cus-name
      v-if="selectShow"
      :visible="selectShow"
      :cusData="cusData"
      @selectCus="handleSelectOk"
      @selectCancle="handleSelectCancle"
    ></select-cus-name>
  </div>
</template>
<script>
import notification from 'ant-design-vue/es/notification'
import {
  addHosMap,
  updateHosMap
} from '@/api/basicInfo/hosData'
import SelectCusName from '@/views/comPublic/modules/SelectCusName'
export default {
  name: 'AddMyCustomer',
  props: ['tabletData'],
  components: {
    SelectCusName
  },
  data () {
    return {
      addBtn: true,
      modelList: [],
      privinceData: [],
      SNtitle: '',
      autoList: [{
        hosName: '华润广东医药有限公司',
        code: '0001'
      }],
      selectShow: false,
      cusData: {},
      isEdit: false,
      orUpdata: true // true可以修改 false时不可修改
    }
  },
  // 创建前的生命周期
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.cusData = JSON.parse(JSON.stringify(this.tabletData))
    // 蚂蚁金服的验证规则
    if (this.cusData.id) {
      this.orUpdata = false
      this.SNtitle = '编辑开票名称'
      this.isEdit = true
    } else {
      this.SNtitle = '新增开票名称'
      this.isEdit = false
    }
  },
  methods: {
    handleProvince (val) {
      console.info('已选择', val)
    },
    addNewName () {

    },
    // 返回到主页面 子组件调用父组件的方法
    handleBack () {
      this.$emit('handleNewSN', false)
    },

    onChangeDegree (value) {
      // console.log("changed", value);
      this.form.setFieldsValue({
        degree: value
      })
    },

    selectModel (value) {},
    handleSelectCus () {
      // console.info('3333')
      this.selectShow = true
      this.cusData = {
        cusName: this.tabletData.hosName,
        cusCode: this.tabletData.hosCode
      }
    },
    // 选择客户名称弹框
    handleSelectOk (subVal) {
      this.cusData.hosName = subVal.cusName
      this.cusData.hosCode = subVal.cusCode
      this.selectShow = false
    },
    handleSelectCancle () {
      this.selectShow = false
    },
    handleSubmit (e) {
      if (this.addBtn) {
        e.preventDefault()
        const _that = this
        if (!this.isEmpty(this.cusData.hosName) && !this.isEmpty(this.cusData.mappingName)) {
          this.addBtn = false
          let params = {}
          params = {
            ..._that.cusData
          }
          // params.mappingName = this.cusData.mappingName.slice(0, 100)
          if (_that.cusData.id) {
            params.id = _that.cusData.id
            this.handleAddSN(params)
          } else {
            _that.addHosMap(params)
          }
        } else {
          _that.$notification['error']({
            message: '提示',
            description: '必填信息不能为空！',
            duration: 4
          })
        }
      }
    },
    isEmpty (str) {
      // 验证是否为空
      if (str === null || str === undefined || str === '') {
        return true
      }
      return false
    },
    handleAddSN (params) {
      updateHosMap(params).then(res => {
        if (res.message === 'SUCCESS') {
          notification.success({
            message: '提示',
            description: '编辑成功'
          })
          this.$emit('handleNewSN', false)
        } else {
          this.addBtn = true
          notification.error({
            message: '错误',
            description: res.message || '编辑失败！'
          })
        }
      })
    },
    addHosMap (params) {
      addHosMap(params).then(res => {
        if (res.message === 'SUCCESS') {
          notification.success({
            message: '提示',
            description: '新增成功'
          })
          this.$emit('handleNewSN', false)
        } else {
          this.addBtn = true
          notification.error({
            message: '错误',
            description: res.message || '新增失败！'
          })
        }
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
      .ant-input,
      .ant-select-selection {
        background: rgba(236, 236, 236, 1) !important;
        color: rgba(193, 193, 193, 1) !important;
        opacity: 1 !important;
      }

      .area-selected-trigger {
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
        float: right;

        &.addInput-tips {
          color: rgba(170, 174, 185, 1);
        }
      }
    }
  }

  .adInput-input {
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
}
.hosBtn{
  background: #f6f6f7;
  border: none;
  margin: 34px 0 0 0;
  display: block;
  width: auto;
  float: left;
  height: 32px;
  .iconfont{
    font-size: 28px;
    line-height: 32px;
    color: #3e4da8;
  }
}
</style>

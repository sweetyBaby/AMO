<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="24">
        <a-col :md="16" :sm="24">
          <h3>{{ SNtitle }}</h3>
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
    <div class="tab_contain">
      <a-tabs>
        <a-tab-pane tab="基本信息" key="basic">
          <a-form layout="inline" :form="form">
            <a-row :gutter="16">
              <a-col :md="12" :sm="12">
                <div class="proNewBorder">
                  <div class="addInput" :class="[!orUpdata?'ban_update':'']">
                    <div class="addInput-title">
                      <small class="ban_small" v-if="!orUpdata">不可修改</small>
                      <small v-else>*</small>
                      <span>产品分类</span>
                    </div>
                    <div class="adInput-input">
                      <a-form-item style="width: 100%" has-feedback>
                        <a-input
                          :disabled="!orUpdata"
                          v-decorator="['productCategory', { rules: [{ required: true, message: '输入产品分类', whitespace: true }]}]"
                          placeholder="输入产品分类"
                          style="width: 100%"
                        />
                      </a-form-item>
                    </div>
                  </div>
                  <div class="addInput" :class="[!orUpdata?'ban_update':'']">
                    <div class="addInput-title">
                      <small class="ban_small" v-if="!orUpdata">不可修改</small>
                      <small v-else>*</small>
                      <span>产品名称</span>
                    </div>
                    <div class="adInput-input">
                      <a-form-item style="width: 100%" has-feedback>
                        <a-input
                          :disabled="!orUpdata"
                          v-decorator="['productName', { rules: [{ required: true, message: '输入产品名称', whitespace: true }]}]"
                          placeholder="输入产品名称"
                          style="width: 100%"
                        />
                      </a-form-item>
                    </div>
                  </div>
                  <!-- <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>批号</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['productBatch', { rules: [{ required: true, message: '请输入批号！', whitespace: true }]}]"
                    placeholder="请输入批号"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
                  </div>-->
                  <!-- <div class="addInput">
                    <div class="addInput-title">
                      <small>*</small>
                      <span>产品有效期</span>
                    </div>
                    <div class="adInput-input">
                      <div class="begin_date">
                        <a-form-item
                          :validate-status="validate.startValue"
                          :help="errorMsg.startValue"
                          style="width: 100%"
                        >
                          <a-date-picker
                            style="width: 100%"
                            :disabledDate="disabledStartDate"
                            v-model="startValue"
                          />
                        </a-form-item>
                      </div>
                    </div>
                  </div>-->
                </div>
              </a-col>
              <a-col :md="12" :sm="12">
                <div class="proNewBorder">
                  <div class="addInput" :class="[!orUpdata?'ban_update':'']">
                    <div class="addInput-title">
                      <small class="ban_small" v-if="!orUpdata">不可修改</small>
                      <small v-else>*</small>
                      <span>产品型号</span>
                    </div>
                    <div class="adInput-input">
                      <div style="margin-bottom: 16px">
                        <a-form-item style="width: 100%" has-feedback>
                          <a-input
                            :disabled="!orUpdata"
                            v-decorator="['productModel', { rules: [{ required: true, message: '产品型号不能为空且只能为字母和数字！', whitespace: true ,pattern:/^[0-9a-zA-Z]{1,}$/}]}]"
                            placeholder="请选择产品型号"
                            style="width: 100%"
                          />
                        </a-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="addInput">
                    <div class="addInput-title">
                      <small>*</small>
                      <span>中文名称</span>
                    </div>
                    <div class="adInput-input">
                      <a-form-item style="width: 100%" has-feedback>
                        <!-- <a-select placeholder="输入中文名称" optionFilterProp="children"
                                            v-decorator="['productNameCn', { rules: [{ required: true, message: '输入中文名称', whitespace: true }]}]">
                                            <a-select-option :value="item" v-for="(item,index) in nameCN" :key="index">
                                                {{item}}
                                            </a-select-option>
                        </a-select>-->
                        <a-input
                          v-decorator="['productNameCn', { rules: [{ required: true, message: '输入中文名称', whitespace: true }]}]"
                          placeholder="输入中文名称"
                          style="width: 100%"
                        />
                      </a-form-item>
                    </div>
                  </div>
                  <!-- <div class="addInput">
                    <div class="addInput-title">
                      <small>*</small>
                      <span>注册证号</span>
                    </div>
                    <div class="adInput-input">
                      <a-form-item style="width: 100%" has-feedback>
                        <a-input
                          placeholder="请输入注册证号"
                          style="width: 100%"
                          v-decorator="['registration', { rules: [{ required: true, message: '请输入注册证号！', whitespace: true }]}]"
                        />
                      </a-form-item>
                    </div>
                  </div>-->

                  <!-- <div class="addInput">
                    <div class="addInput-title">
                      <small>*</small>
                      <span>产品失效期</span>
                    </div>
                    <div class="adInput-input">
                      <a-form-item
                        :validate-status="validate.endValue"
                        :help="errorMsg.endValue"
                        style="width: 100%"
                      >
                        <a-date-picker
                          style="width: 100%"
                          :disabledDate="disabledEndDate"
                          v-model="endValue"
                        />
                      </a-form-item>
                    </div>
                  </div>-->
                </div>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane tab="批号" key="batchNum">
          <product-banch-num
            :branchData="branchData"
            @getParameter="parameterChange"
            @checkSave="checkSave"
          />
        </a-tab-pane>
        <a-tab-pane tab="度数" key="degree">
          <product-degree
            :degreeData="degreeData"
            @getParameter="parameterChange"
            @checkSave="checkSave"
          />
        </a-tab-pane>
        <a-tab-pane tab="注册证号" key="registration">
          <product-registration
            :productRegistrations="productRegistrations"
            @getParameter="parameterChange"
            @checkSave="checkSave"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import notification from 'ant-design-vue/es/notification'
import { addProductTable, findProductMo } from '@/api/basicInfo/hosData'
import ProductBanchNum from './ProductBanchNum'
import ProductDegree from './ProductDegree'
import ProductRegistration from './ProductRegistration'
export default {
  name: 'AddProductData',
  props: ['productSNdata'],
  privinceData: [],
  components: {
    ProductBanchNum,
    ProductDegree,
    ProductRegistration
  },
  data() {
    return {
      addBtn: true,
      checkDegree: [],
      checkRegist: [],
      checkBatches: [],
      productBatches: [],
      productRegistData: [],
      productDegrees: [],
      productRegistrations: [],
      degreeData: [],
      branchData: [],
      validate: {
        startValue: 'success',
        endValue: 'success'
      },
      errorMsg: {
        startValue: null,
        endValue: null
      },
      modelList: [],
      nameCN: [],
      startValue: null,
      endValue: null,
      endOpen: false,
      SNtitle: '',
      orUpdata: true // true可以修改 false时不可修改
    }
  },
  // 创建前的生命周期
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    this.reserveProductMo()
  },
  mounted() {
    // 蚂蚁金服的验证规则
    if (this.productSNdata.id) {
      this.branchData = this.productSNdata.productBatches
      this.degreeData = this.productSNdata.productDegrees
      this.productRegistrations = this.productSNdata.productRegistrations
      this.orUpdata = false
      this.SNtitle = '修改产品主数据'
      this.form.setFieldsValue({
        productName: this.productSNdata.productName,
        productModel: this.productSNdata.productModel,
        productNameCn: this.productSNdata.productNameCn,
        productCategory: this.productSNdata.productCategory
      })
    } else {
      this.SNtitle = '新增产品主数据'
    }
  },
  methods: {
    // 有效期
    onChangeStartDate(date, dateString) {},
    disabledStartDate(startValue) {
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },

    // 失效期
    onChangeEndDate(date, dateString) {},

    disabledEndDate(endValue) {
      const startValue = this.startValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },

    // 返回到主页面 子组件调用父组件的方法
    handleBack() {
      this.$emit('handleNewSN', false)
    },

    handleProvince(val) {
      console.info('已选择', val)
    },
    // 判断是否显示错误信息
    setError(value, errorMsg) {
      if (errorMsg == '') {
        this.validate[value] = 'success'
        this.errorMsg[value] = null
      } else {
        this.validate[value] = 'error'
        this.errorMsg[value] = errorMsg
      }
    },
    checkSave(val, params) {
      if (params == 'branch') {
        this.checkBatches = val
      } else if (params == 'degree') {
        this.checkDegree = val
      } else if (params == 'regist') {
        this.checkRegist = val
      }
    },
    parameterChange(val, parems) {
      if (parems == 'branch') {
        console.log(val)
        this.productBatches = val
      } else if (parems == 'degree') {
        this.productDegrees = val
      } else if (parems == 'regist') {
        this.productRegistData = val
      }
    },
    handleSubmit(e) {
      console.log('=====', this.addBtn)
      if (this.addBtn) {
        let branch = true
        this.checkBatches.map((item, index) => {
          //   console.log(item.effectiveDateBegin);
          //   console.log(moment(item.effectiveDateBegin).format("YYYY-MM-DD"));
          //   console.log(item.effectiveDateEnd);
          //   console.log(moment(item.effectiveDateEnd).format("YYYY-MM-DD"));
          if (item.orUpdate == false) {
            branch = false
            this.$notification['error']({
              message: '提示',
              description: '批号未保存，需将批号保存之后才能提交',
              duration: 8
            })
          }
        })
        let regist = true
        this.checkRegist.map((item, index) => {
          if (item.orUpdate == false) {
            regist = false
            this.$notification['error']({
              message: '提示',
              description: '注册证号未保存，需将注册证号保存之后才能提交',
              duration: 8
            })
          }
        })
        let degree = true
        this.checkDegree.map((item, index) => {
          if (item.orUpdate == false) {
            degree = false
            this.$notification['error']({
              message: '提示',
              description: '度数未保存，需将度数保存之后才能提交',
              duration: 8
            })
          }
        })
        if (branch == true && degree == true && regist == true) {
          this.form.validateFieldsAndScroll((err, values) => {
            let params = {}
            if (!err) {
              this.addBtn = false
              params = {
                productNameCn: values.productNameCn,
                productBatches: this.productBatches,
                productDegrees: this.productDegrees,
                productRegistrations: this.productRegistData,
                productModel: values.productModel,
                productCategory: values.productCategory,
                productName: values.productName
              }
              if (this.productSNdata.id) {
                params.id = this.productSNdata.id
              }
              this.handleAddSN(params)
            }
          })
        }
      }
    },
    handleAddSN(params) {
      addProductTable(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.$emit('handleNewSN', false)
        } else {
          this.addBtn = true
          notification.error({
            message: '错误',
            description: res.message
          })
        }
      })
    },

    reserveProductMo() {
      const params = {
        productModel: ''
      }
      findProductMo(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.modelList = res.data.list
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
    /* >input {
                    background: rgba(247, 250, 255, 1);
                    border: 1px solid rgba(205, 223, 252, 1);
                    color: rgba(159, 172, 195, 1);
                } */
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
}

//tab切换
.tab_contain {
  .ant-tabs-tabpane {
    padding: 0 20px 20px 20px;
  }
  .ant-tabs-tab-active {
    color: #3e4da8;
  }
  .ant-tabs-ink-bar {
    background: #3e4da8;
  }
  .ant-tabs-tab:hover {
    color: #3e4da8;
  }
}
</style>

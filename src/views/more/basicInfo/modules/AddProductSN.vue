
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
          </div>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-form layout="inline" :form="form">
        <a-row :gutter="16">
          <a-col :md="12" :sm="12">
            <div class="proNewBorder">
              <div class="addInput ban_update">
                <div class="addInput-title">
                  <!-- <small class="ban_small">不可修改</small> -->
                  <!-- <small v-else>*</small> -->
                  <span>产品分类</span>
                </div>
                <div class="adInput-input">
                  <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      disabled
                      v-decorator="['productCategory', { rules: [{ required: true, message: '输入产品分类', whitespace: true }]}]"
                      placeholder="输入产品分类"
                      style="width: 100%"
                    />
                  </a-form-item>
                </div>
              </div>

              <div class="addInput">
                <div class="addInput-title">
                  <small>*</small>
                  <span>度数</span>
                </div>
                <div class="adInput-input">
                  <!-- <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      v-decorator="['degree', { rules: [{ required: true, message: '输入度数', whitespace: true ,pattern:/^[0-9]*$/}]}]"
                      placeholder="输入度数"
                      style="width: 100%"
                    />
                  </a-form-item>-->
                  <a-form-item style="width: 100%" has-feedback>
                    <a-select
                      showSearch
                      placeholder="请选择产品度数"
                      optionFilterProp="children"
                      :filterOption="filterOption"
                      v-decorator="['degree', { rules: [{ required: true, message: '请选择产品度数！', whitespace: true }]}]"
                    >
                      <a-select-option
                        :value="item.degree"
                        v-for="(item,index) in degreeList"
                        :key="index"
                      >{{ item.degree }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
              </div>
              <div class="addInput ban_update">
                <div class="addInput-title">
                  <small class="ban_small">不可修改</small>
                  <!-- <small v-else>*</small> -->
                  <span>产品名称</span>
                </div>
                <div class="adInput-input">
                  <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      disabled
                      v-decorator="['productName', { rules: [{ required: true, message: '输入产品名称', whitespace: true }]}]"
                      placeholder="输入产品名称"
                      style="width: 100%"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="addInput" :class="[!orUpdata?'ban_update':'']">
                <div class="addInput-title">
                  <small class="ban_small" v-if="!orUpdata">不可修改</small>
                  <small v-else>*</small>
                  <span>产品序列号</span>
                </div>
                <div class="adInput-input">
                  <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      :disabled="!orUpdata"
                      v-decorator="['udi', { rules: [{ required: true, message: '请输入产品序列号！', whitespace: true }]}]"
                      placeholder="请输入产品序列号"
                      style="width: 100%"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="addInput">
                <div class="addInput-title">
                  <small>*</small>
                  <span>批号</span>
                </div>
                <div class="adInput-input">
                  <!-- <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      v-decorator="['productBatch', { rules: [{ required: true, message: '请输入批号！', whitespace: true }]}]"
                      placeholder="请输入批号"
                      style="width: 100%"
                    />
                  </a-form-item>-->
                  <a-form-item style="width: 100%" has-feedback>
                    <a-select
                      showSearch
                      placeholder="请选择产品批号"
                      optionFilterProp="children"
                      :filterOption="filterOption"
                      v-decorator="['productBatch', { rules: [{ required: true, message: '请选择产品批号！', whitespace: true }]}]"
                    >
                      <a-select-option
                        :value="item.batchNumber"
                        v-for="(item,index) in branchList"
                        :key="index"
                      >{{ item.batchNumber }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
              </div>
            </div>
          </a-col>
          <a-col :md="12" :sm="12">
            <div class="proNewBorder">
              <div class="addInput">
                <div class="addInput-title">
                  <small>*</small>
                  <span>产品型号</span>
                </div>
                <div class="adInput-input">
                  <div style="margin-bottom: 16px">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-select
                        showSearch
                        @change="selectModel"
                        placeholder="请选择产品型号"
                        optionFilterProp="children"
                        :filterOption="filterOption"
                        v-decorator="['productModel', { rules: [{ required: true, message: '请选择产品型号！', whitespace: true }]}]"
                      >
                        <a-select-option
                          :value="item.productModel"
                          v-for="(item,index) in modelList"
                          :key="index"
                        >{{ item.productModel }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </div>
                </div>
              </div>
              <div class="addInput ban_update">
                <div class="addInput-title">
                  <small class="ban_small">不可修改</small>
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
                      disabled
                      v-decorator="['productNameCn', { rules: [{ required: true, message: '输入中文名称', whitespace: true }]}]"
                      placeholder="输入中文名称"
                      style="width: 100%"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="addInput">
                <div class="addInput-title">
                  <small>*</small>
                  <span>注册证号</span>
                </div>
                <div class="adInput-input">
                  <!-- <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      v-decorator="['registration', { rules: [{ required: true, message: '请输入注册证号！', whitespace: true }]}]"
                      placeholder="请输入注册证号"
                      style="width: 100%"
                    />
                  </a-form-item>-->
                  <a-form-item style="width: 100%" has-feedback>
                    <a-select
                      showSearch
                      placeholder="请选择产品注册证号"
                      optionFilterProp="children"
                      :filterOption="filterOption"
                      v-decorator="['registration', { rules: [{ required: true, message: '请选择产品注册证号！', whitespace: true }]}]"
                    >
                      <a-select-option
                        :value="item.registration"
                        v-for="(item,index) in regristList"
                        :key="index"
                      >{{ item.registration }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
              </div>
              <div class="addInput">
                <div class="addInput-title">
                  <small>*</small>
                  <span>生产日期</span>
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
              </div>
              <div class="addInput">
                <div class="addInput-title">
                  <small>*</small>
                  <span>有效日期</span>
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
              </div>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import notification from 'ant-design-vue/es/notification'
import { insertSNData, findProductMo } from '@/api/basicInfo/hosData'
import {
  getProductBatch,
  getDegree,
  retrvieModel
} from '@/api/depot/wareHouse'
export default {
  name: 'AddProductSN',
  props: ['productSNdata'],
  privinceData: [],
  components: {},
  data() {
    return {
      addBtn: true,
      degreeList: [],
      branchList: [],
      regristList: [],
      validate: {
        startValue: 'success',
        endValue: 'success'
      },
      errorMsg: {
        startValue: null,
        endValue: null
      },
      tips: 'sss',
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
      this.orUpdata = false
      this.SNtitle = '修改产品SN数据'
      this.form.setFieldsValue({
        degree: this.productSNdata.degree,
        productName: this.productSNdata.productName,
        udi: this.productSNdata.udi,
        productBatch: this.productSNdata.productBatch,
        productModel: this.productSNdata.productModel,
        productNameCn: this.productSNdata.productNameCn,
        registration: this.productSNdata.registration,
        productCategory: this.productSNdata.productCategory
      })

      console.log(this.productSNdata.effectiveDateBegin)
      if (this.productSNdata.effectiveDateBegin == null) {
        this.startValue = null
      } else {
        this.startValue = moment(
          this.productSNdata.effectiveDateBegin,
          'YYYY-MM-DD'
        )
      }
      if (this.productSNdata.effectiveDateEnd === null) {
        this.endValue = null
      } else {
        this.endValue = moment(
          this.productSNdata.effectiveDateEnd,
          'YYYY-MM-DD'
        )
      }
      this.selectModel(this.productSNdata.productModel)
    } else {
      this.SNtitle = '新增产品SN数据'
      this.selectModel()
    }
  },
  methods: {
    // 有效期
    disabledStartDate(startValue) {
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },

    // 失效期

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

    selectModel(value) {
      for (var i = 0; i < this.modelList.length; i++) {
        if (this.modelList[i].productModel === value) {
          this.form.setFieldsValue({
            productNameCn: this.modelList[i].productNameCn,
            productCategory: this.modelList[i].productCategory,
            productName: this.modelList[i].productName,
            registration: '',
            productBatch: '',
            degree: ''
          })
        }
      }
      const params = {
        productModel: value
      }
      getProductBatch(params).then(res => {
        this.branchList = res.data
      })
      getDegree(params).then(res => {
        this.degreeList = res.data
      })
      retrvieModel(params).then(res => {
        this.regristList = res.data
      })
    },

    onChangeDegree(value) {
      console.log('changed', value)
      this.form.setFieldsValue({
        degree: value
      })
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
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
    handleSubmit(e) {
      if (this.addBtn) {
        e.preventDefault()
        let params = {}
        // 判断日期是否填写
        if (this.startValue === null) {
          this.setError('startValue', '产品生产日期不能为空')
        } else {
          this.setError('startValue', '')
        }

        if (this.endValue === null) {
          this.setError('endValue', '产品有效期不能为空')
        } else {
          this.setError('endValue', '')
        }

        this.form.validateFieldsAndScroll((err, values) => {
          if (
            !err &&
            this.validate.startValue == 'success' &&
            this.validate.endValue == 'success'
          ) {
            this.addBtn = false
            params = {
              productModel: values.productModel,
              productName: values.productName,
              productCategory: values.productCategory,
              productBatch: values.productBatch,
              degree: values.degree,
              productNameCn: values.productNameCn,
              registration: values.registration,
              effectiveDateEnd: moment(this.endValue).format('YYYY-MM-DD'),
              effectiveDateBegin: moment(this.startValue).format('YYYY-MM-DD'),
              udi: values.udi
            }

            if (this.productSNdata.id) {
              params.id = this.productSNdata.id
            }
            //   console.log(params);
            this.handleAddSN(params)
          }
        })
      }
    },

    handleAddSN(params) {
      insertSNData(params).then(res => {
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
          this.modelList = res.data
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

  /* .addInput-tag {
            padding: 24px 0;

            .ant-tag {
                width: 168px;
                height: 36px;
                background: rgba(247, 250, 255, 1);
                border: 1px solid rgba(205, 223, 252, 1);
                border-radius: 4px;
                line-height: 36px;
                color: rgba(159, 172, 195, 1);
                font-size: 14px;
                padding: 0 12px;
                display: inline-block;
                margin: 0 8px 16px 0;

                .anticon {
                    float: right;
                    line-height: 36px;
                    color: rgba(205, 223, 252, 1);
                    font-size: 16px;
                }

                &:hover {
                    background: rgba(229, 238, 255, 1);
                    border-color: rgba(176, 204, 255, 1);
                    color: rgba(66, 131, 255, 1);
                    font-weight: bold;

                    .anticon {
                        color: rgba(66, 131, 255, 1);
                        font-weight: bold;
                    }
                }
            }
        } */
}

/* .area-select-wrap {
        display: flex;
        flex-wrap: nowrap;

        .area-select {
            background: rgba(247, 250, 255, 1);
            border: 1px solid rgba(205, 223, 252, 1);
            color: rgba(159, 172, 195, 1);
            height: 54px;
            width: 50%;
            line-height: 50px;
            display: inline-block;
            position: relative;

            .area-select-icon {
                font-family: 'iconfont';
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
                border: 1px solid #cddffc;
                width: 100%;
                margin: 12px 0 0 0;
                padding: 0;
                list-style: none;
                z-index: 9999;
                position: absolute;
                background: #f7faff;
                max-height: 130px;
                overflow-y: auto;

                li {
                    padding: 0 12px;
                    cursor: pointer;
                    line-height: 32px;
                }
            }
        }
    } */

/* .upload {
        padding: 0 0 24px 0;
    } */

/* tile uploaded pictures */
/* .ant-upload-list {
        float: left;
        width: auto;
    } */

/* .ant-upload-list>.ant-upload-list-item {
        float: left;
        width: 168px;
        height: auto;
        display: inline-block;
        background: rgba(249, 251, 255, 1);
        border: 1px solid rgba(205, 223, 252, 1);
        border-radius: 4px;
        margin-right: 8px;
        padding: 8px;

        .ant-upload-list-item-info {
            >span {
                width: 100%;
                text-align: center;
                display: inline-block;
                height: 100%;
                padding: 0;
                margin: 0;
                min-height: 162px;

                a:first-child {
                    width: 100px;
                    height: 100px;
                    top: auto;
                    left: auto;
                    position: relative;
                    display: inline-block;
                    margin: 8px 0 0 0;

                    img {
                        width: 100px;
                        height: 100px;
                    }

                    .anticon {
                        font-size: 48px;
                        padding: 26px 0;
                        color: rgba(205, 223, 252, 1);
                    }
                }
            }

            .ant-upload-list-item-name {
                padding: 0;
                min-height: 44px;
            }
        }

        .anticon-close {
            font-size: 16px;
            color: rgba(205, 223, 252, 1);
            opacity: 1;
        }
    } */

/* .ant-upload-list>.ant-upload-animate-enter {
        animation-name: uploadAnimateInlineIn;
    }

    .ant-upload-list>.ant-upload-animate-leave {
        animation-name: uploadAnimateInlineOut;
    } */

/* .ant-upload.ant-upload-drag { */
/* border: none;
        background: none;
        text-align: left;
        float: left;
        width: auto;
        display: inline-block; */

/* .ant-upload {
            padding: 0;
        } */

/* .ant-upload-list {
            width: 168px;
            min-height: 180px;
            margin: 0 16px 0 0;

            >.ant-upload-list-item {
                height: 100%;
                min-height: 180px;
            }
        } */

/* } */
</style>

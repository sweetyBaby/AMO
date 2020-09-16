<template>
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
    <a-form layout="inline" :form="form">
      <a-row :gutter="16">
        <a-col :md="12" :sm="12">
          <div class="proNewBorder">
            <div class="addInput ban_update">
              <div class="addInput-title">
                <small class="ban_small">不可修改</small>
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
                                        v-decorator="['degree', { rules: [{ required: true, message: '输入度数', whitespace: true }]}]"
                                        placeholder="输入度数" style="width: 100%" />
                </a-form-item>-->
                <a-form-item style="width: 100%" has-feedback>
                  <a-input-number
                    :step="0.5"
                    v-decorator="['degree', { rules: [{ required: true, message: '输入度数(只能为数字)'}]}]"
                    style="width: 100%"
                    @change="onChangeNumber"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput ban_update">
              <div class="addInput-title">
                <small class="ban_small">不可修改</small>
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
                    <a-select
                      showSearch
                      placeholder="请选择产品型号"
                      optionFilterProp="children"
                      @change="selectModel"
                      :filterOption="filterOption"
                      :disabled="!orUpdata"
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
                  <a-input
                    disabled
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
                                <span>批号</span>
                            </div>
                            <div class="adInput-input">
                                <a-form-item style="width: 100%" has-feedback>
                                    <a-input
                                        v-decorator="['productBatch', { rules: [{ required: true, message: '输入批号', whitespace: true }]}]"
                                        placeholder="输入批号" style="width: 100%" />
                                </a-form-item>
                            </div>
            </div>-->
          </div>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import moment from 'moment'
import notification from 'ant-design-vue/es/notification'
import { addProductDegree, findProductMo } from '@/api/basicInfo/hosData'
export default {
  name: 'AddProductDegree',
  props: ['productSNdata'],
  privinceData: [],
  components: {},
  data() {
    return {
      degree: '',
      validate: null,
      errorMsg: null,
      productId: '',
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
      this.SNtitle = '修改产品度数'
      this.form.setFieldsValue({
        degree: this.productSNdata.degree,
        productName: this.productSNdata.productName,
        productModel: this.productSNdata.productModel,
        productNameCn: this.productSNdata.productNameCn,
        productCategory: this.productSNdata.productCategory,
        productBatch: this.productSNdata.productBatch
      })
    } else {
      this.SNtitle = '新增产品度数'
    }
  },
  methods: {
    // 有效期
    // onChangeStartDate(date, dateString) {
    // },
    onChangeNumber(value) {
      console.log(value)
      this.degree = value
    },
    disabledStartDate(startValue) {
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },

    // 失效期
    // onChangeEndDate(date, dateString) {
    // },

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
      // this.form.setFieldsValue({
      //     productNameCn: ''
      // });
      // for (var i = 0; i < this.modelList.length; i++) {
      //     if (this.modelList[i].productModel === value) {
      //         this.nameCN[0] = this.modelList[i].productNameCn
      //     }
      // }
      for (var i = 0; i < this.modelList.length; i++) {
        if (this.modelList[i].productModel === value) {
          this.form.setFieldsValue({
            productNameCn: this.modelList[i].productNameCn,
            productCategory: this.modelList[i].productCategory,
            productName: this.modelList[i].productName
          })
          this.productId = this.modelList[i].id
        }
      }
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
    handleSubmit(e) {
      e.preventDefault()

      this.form.validateFieldsAndScroll((err, values) => {
        // console.log(values.degree);
        if (!err) {
          const params = {
            productId: this.productId,
            productModel: values.productModel,
            productName: values.productName,
            productCategory: values.productCategory,
            degree: values.degree,
            productNameCn: values.productNameCn,
            productBatch: values.productBatch
          }
          if (this.productSNdata.id) {
            params.id = this.productSNdata.id
          }
          console.log(params)
          this.handleAddSN(params)
        }
      })
    },

    handleAddSN(params) {
      addProductDegree(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.$emit('handleNewSN', false)
        } else {
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

      .ant-select-selection {
        background: rgba(236, 236, 236, 1) !important;
        color: rgba(193, 193, 193, 1) !important;
        border: 1px solid #ececec !important;
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

    .ant-input-number{
      height: 44px;
      background: rgba(252, 252, 252, 1);
      border: 1px solid rgba(236, 236, 236, 1);
      opacity: 1;
      border-radius: 4px;
    }

    .ant-input-number-input {
      width: 100%;
      height: 44px;
    //   background: rgba(252, 252, 252, 1);
    //   border: 1px solid rgba(236, 236, 236, 1);
    //   opacity: 1;
    //   border-radius: 4px;
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

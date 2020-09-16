<template>
  <div class="page">
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
    <a-form layout="inline" :form="form">
      <a-row :gutter="16">
        <a-col :md="8" :sm="12">
          <div class="proNewBorder">
            <div class="addInput" :class="[!orUpdata?'ban_update':'']">
              <div class="addInput-title">
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <small v-else>*</small>
                <span>客户名称</span>
              </div>
              <div class="adInput-input">
                <div style="margin-bottom: 16px">
                  <a-form-item style="width: 100%" has-feedback>
                    <!-- <a-select
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
                      >{{item.productModel}}</a-select-option>
                    </a-select>-->

                    <a-input
                      v-decorator="['clientName', { rules: [{ required: false, message: '输入客户名称', whitespace: true }]}]"
                      placeholder="输入客户名称"
                      style="width: 100%"
                    />
                  </a-form-item>
                </div>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <!-- <small>*</small> -->
                <span>自定义客户名称</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['distCusName', { rules: [{ required: false, message: '输入自定义客户名称', whitespace: true }]}]"
                    placeholder="输入自定义客户名称"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <!-- <small>*</small> -->
                <span>联系方式</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['contactPhone', { rules: [{ required: false,pattern:/^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入联系方式！', whitespace: true }]}]"
                    placeholder="请输入联系方式"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <!-- <small>*</small> -->
                <span>联系人邮箱</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['contactEmail', { rules: [{ required: false, pattern:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,message: '请输入正确邮箱！', whitespace: true }]}]"
                    placeholder="请输入联系人邮箱"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :md="8" :sm="12">
          <div class="proNewBorder">
            <div class="addInput">
              <div class="addInput-title">
                <!-- <small>*</small> -->
                <span>自定义客户代码</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['distCusCode', { rules: [{ required: false, message: '请输入自定义客户代码！', whitespace: true }]}]"
                    placeholder="请输入自定义客户代码"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput" :class="[!orUpdata?'ban_update':'']">
              <div class="addInput-title">
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <small v-else>*</small>
                <span>客户代码</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    v-decorator="['cusCode', { rules: [{ required: false, message: '输入客户代码', whitespace: true }]}]"
                    placeholder="输入客户代码"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <!-- <small>*</small> -->
                <span>联系人</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['contacts', { rules: [{ required: false, message: '请输入联系人！', whitespace: true }]}]"
                    placeholder="请输入联系人"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <!-- <small>*</small> -->
                <span>微信</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['contactWechat', { rules: [{ required: false, message: '请输入微信号！', whitespace: true }]}]"
                    placeholder="请输入微信号"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :md="8" :sm="12">
          <div class="proNewBorder">
            <div class="addInput" :class="[!orUpdata?'ban_update':'']">
              <div class="addInput-title">
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <small v-else>*</small>
                <span>医院所属地址</span>
              </div>
              <div class="adInput-input">
                <!-- <area-select
                  :disabled="!orUpdata"
                  v-model="privinceData"
                  size="large"
                  @change="handleProvince"
                  :data="pca"
                  icon="icon-arrow-down "
                />-->
                <a-row :gutter="16">
                  <a-col :md="12" :sm="12">
                    <a-form-item has-feedback>
                      <a-input
                        :disabled="!orUpdata"
                        v-decorator="['province', { rules: [{ required: false, message: '输入所在省', whitespace: true }]}]"
                        placeholder="输入所在省"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :md="12" :sm="12">
                    <a-form-item has-feedback>
                      <a-input
                        :disabled="!orUpdata"
                        v-decorator="['city', { rules: [{ required: false, message: '输入所在城市', whitespace: true }]}]"
                        placeholder="输入所在城市"
                        style="width: 100%; "
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
            </div>
            <div class="addInput" :class="[!orUpdata?'ban_update':'']">
              <div class="addInput-title">
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <small v-else>*</small>
                <span>详细地址</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    v-decorator="['detail', { rules: [{ required: false, message: '请输入详细地址！', whitespace: true }]}]"
                    placeholder="请输入详细地址"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput" :class="[!orUpdata?'ban_update':'']">
              <div class="addInput-title">
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <small v-else>*</small>
                <span>客户类型</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    showSearch
                    placeholder="请选择客户类型"
                    optionFilterProp="children"
                    @change="selectModel"
                    :filterOption="filterOption"
                    :disabled="!orUpdata"
                    v-decorator="['cusType', { rules: [{ required: false, message: '请选择客户类型！', whitespace: true }]}]"
                  >
                    <a-select-option value="0">经销商</a-select-option>
                    <a-select-option value="1">配送商</a-select-option>
                    <a-select-option value="2">医院</a-select-option>
                    <a-select-option value="3">厂商</a-select-option>
                    <a-select-option value="4">总代</a-select-option>
                    <a-select-option value="5">其它</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import { AreaSelect } from 'vue-area-linkage'
import { pca, pcaa } from 'area-data'
import moment from 'moment'
import notification from 'ant-design-vue/es/notification'
import { addOrUpdateCus } from '@/api/information'
export default {
  name: 'AddMyCustomer',
  props: ['tabletData'],

  components: {
    AreaSelect
  },
  data() {
    return {
      addBtn: true,
      modelList: [],
      pca,
      pcaa,
      privinceData: [],
      SNtitle: '',
      orUpdata: true // true可以修改 false时不可修改
    }
  },
  // 创建前的生命周期
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    // this.reserveProductMo();
  },
  mounted() {
    // 蚂蚁金服的验证规则
    if (this.tabletData.id) {
      this.orUpdata = false
      this.SNtitle = '修改客户信息'
      this.form.setFieldsValue({
        clientName: this.tabletData.clientName,
        distCusName: this.tabletData.distCusName,
        contactPhone: this.tabletData.contactPhone,
        contactEmail: this.tabletData.contactEmail,
        distCusCode: this.tabletData.distCusCode,
        cusCode: this.tabletData.cusCode,
        contacts: this.tabletData.contacts,
        contactWechat: this.tabletData.contactWechat,
        detail: this.tabletData.detail,
        cusType: this.tabletData.cusType,
        city: this.tabletData.city,
        province: this.tabletData.province
      })
    } else {
      this.SNtitle = '新增客户信息'
    }
  },
  methods: {
    handleProvince(val) {
      console.info('已选择', val)
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },

    // 返回到主页面 子组件调用父组件的方法
    handleBack() {
      this.$emit('handleNewSN', false)
    },

    onChangeDegree(value) {
      // console.log("changed", value);
      this.form.setFieldsValue({
        degree: value
      })
    },

    selectModel(value) {},

    handleSubmit(e) {
      if (this.addBtn) {
        e.preventDefault()
        const _that = this
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.addBtn = false
            let params = {}
            params = {
              clientName: values.clientName,
              distCusName: values.distCusName == null ? null : values.distCusName.replace(/\s+/g, ''),
              contactPhone: values.contactPhone,
              contactEmail: values.contactEmail,
              distCusCode: values.distCusCode == null ? null : values.distCusCode.replace(/\s+/g, ''),
              cusCode: values.cusCode,
              contacts: values.contacts,
              contactWechat: values.contactWechat,
              detail: values.detail,
              cusType: values.cusType
            }
            if (_that.tabletData.id) {
              params.id = _that.tabletData.id
            }
            // console.log(params);
            this.handleAddSN(params)
          }
        })
      }
    },

    handleAddSN(params) {
      addOrUpdateCus(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.$emit('handleNewSN', false)
        } else {
          this.addBtn = true
          notification.error({
            message: '错误',
            description: res.message || '保存出错了'
          })
        }
      })
    }
    // reserveProductMo() {
    //   let params = {
    //     productModel: ""
    //   };
    //   findProductMo(params).then(res => {
    //     if (res.message === "SUCCESS") {
    //       this.modelList = res.data;
    //     }
    //   });
    // }
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

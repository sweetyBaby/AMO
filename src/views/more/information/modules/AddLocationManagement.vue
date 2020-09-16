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

    <a-form layout="inline" :form="form">
      <a-row :gutter="16">
        <a-col :md="12" :sm="12">
          <div class="proNewBorder">
            <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>库位名称</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    @change="handelName"
                    v-decorator="['whName', { rules: [{ required: true, message: '输入库位名称', whitespace: true }]}]"
                    placeholder="输入库位名称"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput" :class="[!orUpdata?'ban_update':'']">
              <div class="addInput-title">
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <!-- <small v-else>*</small> -->
                <span>库位代码</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    has-feedback
                    :validate-status="status"
                    :help="errMsg"
                    placeholder="输入库位代码"
                    style="width: 100%"
                    v-decorator="['whCode']"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput" :class="[!orUpdata?'ban_update':'']">
              <div class="addInput-title">
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <small v-else>*</small>
                <span>库位类型</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    @change="handleChange"
                    :disabled="!orUpdata"
                    placeholder="请选择库位类型"
                    v-decorator="['type', { rules: [{ required: true, message: '请选择库位类型！', whitespace: true }]}]"
                  >
                    <a-select-option value="1">自有库位</a-select-option>
                    <a-select-option value="3">自有寄售</a-select-option>
                    <!-- <a-select-option value="3">华润寄售</a-select-option> -->
                    <a-select-option value="4">污损库</a-select-option>
                    <!--                    <a-select-option value="5">报废库</a-select-option>-->
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="addInput" v-if="allWarn==='1'||allWarn==='3'">
              <div class="addInput-title">
                <span>所有型号一键预警 (最低库存)</span>
                <!-- <small class="ban_small" v-if="!allWarning">不可修改</small> -->
                <!-- <small v-else>*</small> -->
                <!-- <span>
                  <a-checkbox :checked="this.allWarning" @change="onChangeWarin">所有型号一键预警 (最低库存)</a-checkbox>
                </span>-->
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['earlyWarningInventory', { rules: [{ required: false, message: '输入正确最低库存', whitespace: true ,pattern:/^[0-9]*$/}]}]"
                    placeholder="安全库存数量 >= 未来三个月市场销量指标片数之和"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :md="12" :sm="12">
          <div class="proNewBorder">
            <div class="addInput" v-show="this.radio">
              <div class="addInput-title">
                <small>*</small>
                <span>是否为主库</span>
              </div>
              <div class="adInput-input">
                <div style="margin-bottom: 16px">
                  <a-form-item style="width: 100%" has-feedback>
                    <a-select
                      @change="onChange"
                      placeholder="请选择是否为主库"
                      v-decorator="['isPrimary', { rules: [{ required: true, message: '请选择是否为主库', whitespace: true }]}]"
                    >
                      <a-select-option value="1" v-if="this.main">是</a-select-option>
                      <a-select-option value="0">否</a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <span>库位地址</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['address', { rules: [{ required: false, message: '请输入库位地址！', whitespace: true }]}]"
                    placeholder="请输入库位地址"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <span>备注</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['remark', { rules: [{ required: false, message: '输入备注', whitespace: true }]}]"
                    placeholder="输入备注"
                    style="width: 100%"
                  />
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
import moment from 'moment'
import notification from 'ant-design-vue/es/notification'
import { addLocation, updateLocation, generateCode } from '@/api/information'
var pinyin = require('pinyin')
export default {
  name: 'AddLocationManagement',
  props: ['tabletData'],
  privinceData: [],
  components: {},
  data () {
    return {
      status: '',
      errMsg: null,
      getName: null,
      allWarn: null,
      addBtn: true,
      main: true,
      radio: true,
      //   allWarning: false,
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
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    // console.log(
    //   pinyin("啊饿ssh22", {
    //     style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
    //     heteronym: true
    //   })
    // );
  },
  mounted () {
    // console.log(this.tabletData.isPrimary);
    if (this.tabletData.isPrimary === 1) {
      this.radio = false
    }
    if (this.tabletData.type === '1') {
      this.main = true
    } else {
      this.main = false
    }
    // 蚂蚁金服的验证规则
    if (this.tabletData.id) {
      // console.log(this.tabletData.earlyWarningInventory);
      this.allWarn = this.tabletData.type
      this.orUpdata = false
      this.SNtitle = '修改库位'
      this.form.setFieldsValue({
        whName: this.tabletData.whName,
        whCode: this.tabletData.whCode,
        serialNumber: this.tabletData.serialNumber,
        type: this.tabletData.type,
        address: this.tabletData.address,
        isPrimary: this.tabletData.isPrimary + '',
        remark: this.tabletData.remark
      })
      if (this.tabletData.type === '1' || this.tabletData.type === '3') {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            earlyWarningInventory: this.tabletData.earlyWarningInventory
          })
        })
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            earlyWarningInventory: undefined
          })
        })
      }
    } else {
      this.SNtitle = '新增库位'
    }
  },
  methods: {
    getWhCode () {
      this.getCode = pinyin(this.getName, {
        style: pinyin.STYLE_FIRST_LETTER,
        heteronym: true
      })
      //   console.log(this.getCode.join(''));
      this.form.setFieldsValue({
        whCode: this.getCode.join('').toLocaleUpperCase()
      })
    },
    handelName (e) {
      if (!this.tabletData.id) {
        this.getName = e.target.value
        // this.getWhCode();
        this.getWhCodeEnglish()
      }
    },

    getWhCodeEnglish () {
      const params = {
        whName: this.getName
      }
      generateCode(params).then(res => {
        // console.log(res);
        if (res.message === 'SUCCESS') {
          this.status = 'success'
          this.errMsg = null
          this.form.setFieldsValue({
            whCode: res.data
          })
        } else {
          this.status = 'error'
          this.errMsg = res.message
        }
      })
    },
    onChange (value) {
      if (value === '1') {
        this.$confirm({
          title: '是否设为主库',
          content: '是否替换主库为当前库位',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.form.setFieldsValue({ isPrimary: '1' })
          },
          onCancel: () => {
            this.form.setFieldsValue({ isPrimary: '0' })
          }
        })
      }
    },
    handleChange (value) {
      console.log(value)
      this.allWarn = value
      this.form.setFieldsValue({ isPrimary: undefined })
      if (value === '1') {
        this.main = true
      } else {
        this.main = false
      }
    },
    // onChangeWarin() {
    //   this.allWarning = !this.allWarning;
    // },
    // 返回到主页面 子组件调用父组件的方法
    handleBack () {
      this.$emit('handleNewSN', false)
    },

    handleProvince (val) {
      console.info('已选择', val)
    },

    onChangeDegree (value) {
      // console.log("changed", value);
      this.form.setFieldsValue({
        degree: value
      })
    },

    handleSubmit (e) {
      if (this.addBtn) {
        e.preventDefault()
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.addBtn = false
            let params = {}
            params = {
              distCode: this.tabletData.distCode,
              whName:
                values.whName == null
                  ? null
                  : values.whName.replace(/\s+/g, ''),
              whCode:
                values.whCode == null
                  ? null
                  : values.whCode.replace(/\s+/g, ''),
              type: values.type,
              address: values.address,
              isPrimary: values.isPrimary,
              remark: values.remark,
              earlyWarningInventory: values.earlyWarningInventory
            }
            if (this.tabletData.id) {
              params.id = this.tabletData.id
              this.handleupdate(params)
            } else {
              // console.log(params);
              this.handleAddSN(params)
            }
          }
        })
      }
    },
    handleupdate (params) {
      updateLocation(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.$emit('handleNewSN', false)
        } else {
          this.addBtn = true
          notification.error({
            message: '错误',
            description: res.data
          })
        }
      })
    },
    handleAddSN (params) {
      addLocation(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.$emit('handleNewSN', false)
        } else {
          this.addBtn = true
          notification.error({
            message: '错误',
            description: res.data
          })
        }
      })
    }
  }
}
</script>
    <style lang="less">
/* 设置库存预警 */
.inventory {
  margin-top: 32px;
  .inventory_header {
    .inventory_title {
      color: rgba(147, 147, 147, 1);
      font-size: 14px;
      font-family: PingFang SC;
      margin-right: 12px;
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

    .adInput-input {
      .ant-input {
        background: rgba(236, 236, 236, 1) !important;
        color: rgba(193, 193, 193, 1) !important;
        opacity: 1 !important;
      }
    }
    .ant-select-selection {
      background: rgba(236, 236, 236, 1) !important;
      color: rgba(193, 193, 193, 1) !important;
      opacity: 1 !important;
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
      background: rgba(252, 252, 252, 1);
      border: 1px solid #ececec;
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

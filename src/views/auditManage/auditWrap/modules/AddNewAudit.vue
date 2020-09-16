<template>
  <a-spin :spinning="confirmLoading" class="modal-info">
    <a-form layout="inline" :form="form">
      <div class="searchWrap">
        <div class="searchList">
          <label for=""><small>*</small>审计项目名称</label>
          <div class="scanDetail">
            <a-form-item style="width: 100%" has-feedback>
              <a-input
                style="width: 100%"
                placeholder="审计项目名称"
                v-decorator="['auditName', { rules: [{ required: true, message: '请输入审计项目名称！', whitespace: true }]}]"
              />
            </a-form-item>
          </div>
        </div>
        <div class="searchList">
          <label for="">经销商名称/客户名称</label>
          <div class="scanDetail">
            <a-form-item style="width: 100%" has-feedback>
              <a-input-group compact>
                <a-select
                  style="width:30%"
                  placeholder="经销商"
                  v-model="authorize"
                  @change="handleAuth"
                >
                  <a-select-option value="has">经销商</a-select-option>
                  <a-select-option value="hasNo">客户</a-select-option>
                </a-select>
                <a-input
                  style="width: 70%"
                  placeholder="请选择经销商"
                  @click="handleCusShow('dist')"
                  v-decorator="['distName', { rules: [{ required: false, message: '请选择经销商！', whitespace: true }]}]"
                  v-if="authorize === 'has'"
                />
                <a-input
                  style="width: 70%"
                  placeholder="请选择客户"
                  @click="handleCusShow('cus')"
                  v-decorator="['cusName', { rules: [{ required: false, message: '请选择客户！', whitespace: true }]}]"
                  v-if="authorize !== 'has'"
                />
              </a-input-group>
            </a-form-item>
          </div>
        </div>
        <div class="searchList">
          <label for="">发票始/止时间</label>
          <div class="scanDetail">
            <a-form-item style="width: 100%" has-feedback>
              <a-range-picker
                style="width: 100%"
                @change="onChangeEnd"
                :format="dateFormat"
                :disabledDate="disabledEndDate"
                v-decorator="['endTime', { rules: [{ type: 'array', required: false }]}]"
              ></a-range-picker>
            </a-form-item>
          </div>
        </div>
        <div class="searchList">
          <label for="">销量月份</label>
          <div class="scanDetail">
            <a-form-item style="width: 100%" has-feedback>
              <a-month-picker
                style="width: 100%"
                @change="onChangeMonth"
                :disabledDate="disabledMonth"
                v-decorator="['saleYearMonth', { rules: [{ required: false }]}]"
              ></a-month-picker>
            </a-form-item>
          </div>
        </div>
        <span class="table-page-search-submitButtons">
          <a-button type="primary" @click="handleSubmit" size="small">确认</a-button>
          <a-button style="margin-left: 8px" @click="handleCancel" size="small">取消</a-button>
        </span>
      </div>
    </a-form>
    <more-cus-name
      v-if="selectShow"
      :visible="selectShow"
      :cusData="selectData"
      @selectCus="handleSelectOk"
      @selectCancle="handleSelectCancle"
    ></more-cus-name>
  </a-spin>
</template>

<script>
import moment from 'moment'
import { getRegistration, findJsList, userDistRange } from '@/api/depot/wareHouse'
import { auditNewAdd } from '@/api/auditManage/auditManage'
import MoreCusName from './MoreCusName'

export default {
  name: 'AddNewAudit',
  props: ['editData'],
  components: {
    MoreCusName
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.getFirst()
  },
  data () {
    // console.info('editData-====', this.editData)
    return {
      confirmLoading: false,
      form: this.$form.createForm(this),
      proData: {
        whCode: undefined
      },
      startTime: null,
      endTime: null,
      dateFormat: 'YYYY-MM-DD',
      isSn: false,
      unitList: ['盒'],
      isdelivery: false,
      isAllot: false,
      proNum: {
        value: 1,
        validateStatus: 'success'
      },
      proReason: {
        value: '新增无码出库理由',
        validateStatus: 'success'
      },
      proWhChange: {
        value: undefined,
        validateStatus: 'success'
      },
      whList: [],
      scodeList: [],
      isModelOnly: false,
      distList: [],
      cusList: [],
      selectShow: false,
      selectData: {
        type: 'all'
      },
      invoiceStartDate: null,
      invoiceEndDate: null,
      authorize: 'has'
    }
  },
  methods: {
    moment,
    handleSubmit (e) {
      e.preventDefault()
      const _that = this
      this.form.validateFieldsAndScroll((err, values) => {
        // console.info('this.proNum.validateStatus',_that.proNum.validateStatus)
        if (!err && _that.proNum.validateStatus === 'success') {
          if (!this.proData.distCodes && !this.proData.cusCodes && !this.invoiceStartDate && !this.invoiceEndDate && !values.saleYearMonth) {
            this.$notification['error']({
              message: '提示',
              description: '发起审计时至少选择一个条件呦~',
              duration: 4
            })
          } else if (this.invoiceStartDate && values.saleYearMonth) {
            this.$notification['error']({
              message: '提示',
              description: '发票始/止时间和销量月份不可以同时选择！！',
              duration: 4
            })
          } else {
            values.invoiceStartDate = this.invoiceStartDate
            values.invoiceEndDate = this.invoiceEndDate
            values.saleYearMonth = values.saleYearMonth ? moment(values.saleYearMonth).format('YYYY-MM') : null
            if (this.authorize !== 'has' && this.proData.cusCodes) {
              values.cusCodes = []
              this.proData.cusCodes.map(item => {
                if (values.cusCodes.findIndex(code => code === item.hosCode) === -1) {
                  values.cusCodes.push(item.hosCode)
                }
              })
            } else if (this.authorize === 'has' && this.proData.distCodes) {
              values.distCodes = []
              this.proData.distCodes.map(item => {
                if (values.distCodes.indexOf(code => code === item.distCode) === -1) {
                  values.distCodes.push(item.distCode)
                }
              })
            }
            values.voucherStatus = this.editData.voucherStatus
            auditNewAdd(values).then(res => {
              console.info('res====', res)
              if (res.message === 'SUCCESS') {
                this.$notification['success']({
                  message: '新增成功',
                  description: '新增成功！',
                  duration: 4
                })
                this.$emit('submit')
              } else {
                this.$notification['error']({
                  message: '新增失败',
                  description: res.message || '新增失败！',
                  duration: 4
                })
              }
            })
          }
        }
      })
      // console.info('proData----', this.proData)
    },
    handleCancel () {
      this.$emit('cancel', false)
    },
    onChangeStart (e, startTime) {
      this.effectiveDateBegin = e
      this.proData.effectiveDateBegin = startTime
    },
    onChangeEnd (e, endTime) {
      console.info(';', e)
      if (e.length > 0) {
        this.effectiveDateEnd = e
        this.invoiceStartDate = moment(e[0]).format('YYYY-MM-DD')
        this.invoiceEndDate = moment(e[1]).format('YYYY-MM-DD')
      } else {
        this.effectiveDateEnd = null
        this.invoiceStartDate = null
        this.invoiceEndDate = null
      }
    },
    onChangeMonth (e, endTime) {

    },
    handleSelect (val) {
      // console.info(val)
      this.proData.umo = val
    },
    changeNum (val) {
      this.proData.qty = val
    },
    handleNumberChange (e) {
      // console.info('value---',e)
      this.proNum = {
        ...validatePrimeNumber(e.target.value),
        value: e.target.value
      }
    },
    disabledStartDate (current) {
      return current && current > moment().endOf('day')
    },
    disabledEndDate (endValue) {
      const startValue = this.startTime
      // console.info('endValue',endValue)
      if (!endValue || !startValue) {
        return false
      }
      return endValue.valueOf() < startValue.valueOf()
    },
    disabledMonth (endValue) {
      return endValue.valueOf() > moment().subtract(1, 'month').valueOf()
    },
    handleChange (val) {
      console.info(val)
      this.proData.distCode = val[0]
    },
    handleCusShow (val) {
      // console.info('val---', val)
      if (val === 'dist') {
        this.selectData = {
          distCode: this.proData.distCodes,
          distName: this.proData.distName,
          type: 'dist',
          title: '选择经销商'
        }
      } else {
        this.selectData = {
          cusCode: this.proData.cusCodes,
          cusName: this.proData.cusName,
          type: 'cus',
          title: '选择客户名称'
        }
      }
      this.selectShow = true
    },
    handleSelectOk (subVal) {
      // console.info('subVal', subVal)
      if (subVal[0].hosCode) {
        this.proData.cusCodes = subVal.filter(item => item.hosCode)
        this.form.setFieldsValue({
          'cusName': subVal[0].hosName
        })
        this.proData.cusCode = subVal[0].hosCode
      } else {
        this.proData.distCodes = subVal.filter(item => item.distCode)
        this.form.setFieldsValue({
          'distName': subVal[0].distName
        })
        this.proData.distCode = subVal[0].distCode
      }
      // console.info('this.proData.cusCodes===', this.proData.cusCodes)
      this.selectShow = false
    },
    handleSelectCancle () {
      this.selectShow = false
    },
    handleAuth (val) {
      if (val === 'has') {
        this.proData.cusCodes = []
      } else {
        this.proData.distCodes = []
      }
    },
    getFirst () {
      userDistRange().then(res => {
        this.distList = res.data
      })
      this.form.setFieldsValue({
        'distCodes': undefined,
        'auditName': '',
        'cusCodes': undefined,
        'cusName': undefined,
        'endTime': null
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .ant-form-inline .ant-form-item-with-help {
    margin: 0;
  }

  .searchWrap {
    overflow-x: hidden;

    .searchList {
      label {
        small {
          color: red;
          padding: 0 4px 0 0;
        }
      }
    }
  }

  .addInput {
    margin: 16px 0 0 0;

    .addInput-title {
      padding: 0 0 8px 0;
      font-size: 14px;

      span {
        font-weight: bold;;
        color: rgba(84, 97, 130, 1);
      }

      small {
        color: rgba(66, 131, 255, 1);
        float: right;

        &.addInput-tips {
          color: rgba(170, 174, 185, 1);
        }
      }
    }
  }

  .adInput-input {
    .ant-select-selection--single {
      height: 54px;
    }

    .ant-select-selection__rendered {
      line-height: 54px;
    }

    .ant-form-item, .ant-form-item-control-wrapper, .ant-form-item-control {
      width: 100%;
    }

    .ant-input {
      height: 54px;
      width: 100%;
      line-height: 54px;
      background: rgba(247, 250, 255, 1);
      border: 1px solid rgba(233, 233, 233, 1);
    }

    .ant-input-affix-wrapper .ant-input-suffix {
      .icon-cancle {
        color: rgba(205, 223, 252, 1);
        font-size: 24px;
      }
    }
  }

  .editScan {
    .ant-modal-content {
      .ant-modal-body {
        padding: 0;

        .scanEdit {
          position: relative;
          padding: 0;

          .scanLeft {
            width: 100%;
            padding: 0;
            box-sizing: border-box;
          }

          .scanMain {
            display: inline-block;
            width: 100%;

            label {
              font-size: 14px;
              color: rgba(147, 147, 147, 1);
              padding: 18px 0 0 0;
              width: 100%;

              small {
                color: red;
                padding: 0 4px 0 0;
              }
            }

            .scanDetail {
              .ant-form-item-control-wrapper, .ant-form-item-control {
                width: 100%;
              }

              .ant-calendar-picker {
                width: 100%;
                max-width: inherit;
              }

              /deep/ .ant-select-selection--single {
                margin: 8px 0 0 0;
                height: 44px;
                width: 100%;
                display: inline-block;

                .ant-select-selection__rendered {
                  line-height: 44px;
                }
              }

              /deep/ .ant-calendar-picker {
                height: 44px;
                margin: 8px 0 0 0;

                .ant-input {
                  height: 44px;
                  line-height: 36px;
                }
              }

              span.scanCon {
                color: rgba(52, 53, 62, 1);
                font-size: 18px;
                font-weight: bold;
                height: 44px;
                line-height: 44px;
                margin: 8px 0 0 0;
                display: inline-block;
              }

              .ant-input, .ant-input-number, .ant-select-selection {
                height: 44px;
                line-height: 44px;
                margin: 8px 0 0 0;
                font-size: 14px;
                color: rgba(52, 53, 62, 1);
                font-weight: bold;

                /*&::-webkit-input-placeholder {*/
                /*  color: rgba(52, 53, 62, 1) !important;*/
                /*}*/

                .ant-select-selection__rendered {
                  line-height: 42px;
                }
              }
            }
          }

          .scanBorder {
            width: 100%;
            height: 1px;
            background: rgba(235, 235, 235, 1);
            display: block;
            margin: 18px 0;
          }
        }

        .modal-info {
          .ant-spin-container {
            .ant-row {
              & > div {
                padding: 0;
                border: none;
              }
            }
          }
        }
      }
    }
  }

  .has-error {
    .ant-select-selection {
      border: 1px solid #f5222d !important;
    }

    .ant-form-explain {
      color: #f5222d;
    }
  }

  /deep/ .ant-select-selection--multiple .ant-select-search--inline {
    display: none;
  }
</style>

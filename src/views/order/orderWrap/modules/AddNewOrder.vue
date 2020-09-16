<template>
  <a-spin :spinning="confirmLoading" class="modal-info">
    <a-form layout="inline" :form="form">
      <div class="searchWrap">
        <div class="searchList">
          <label for=""><small>*</small>选择经销商</label>
          <a-form-item style="width: 100%" has-feedback>
            <a-select
              v-if="!isDist"
              showSearch
              style="width: 100%;"
              placeholder="选择经销商"
              v-decorator="['distCode', { rules: [{ required: true, message: '选择经销商！', whitespace: true }]}]"
              optionFilterProp="children"
              @change="handleDist"
            >
              <a-select-option
                v-for="item in distList"
                :key="item.distCode"
                :value="item.distCode"
              >
                {{ item.distName }}
              </a-select-option>
            </a-select>
            <a-input
              v-if="isDist"
              :value="distName"
              :disabled="true"
            >
            </a-input>
          </a-form-item>
        </div>
        <div class="searchList">
          <label for=""><small>*</small>产品型号</label>
          <a-form-item style="width: 100%" has-feedback>
            <a-select
              v-decorator="['productModel', { rules: [{ required: true, message: '请输入产品型号！', whitespace: true }]}]"
              placeholder="请选择产品型号"
              style="width: 100%"
              @change="handleSelect"
              :getPopupContainer="triggerNode => triggerNode.parentNode"
            >
              <a-select-option v-for="(item,index) in typeList" :key="item.crgdProductId" :value="item.productModel">{{ item.productModel }}</a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <div class="searchList">
          <label for=""><small>*</small>产品度数</label>
          <a-form-item style="width: 100%" has-feedback>
            <!--            <a-input-->
            <!--                v-decorator="['degree', { rules: [{ required: true, message: '请输入产品度数！', whitespace: true }]}]"-->
            <!--                placeholder="请选择产品度数"-->
            <!--                style="width: 100%"-->
            <!--            >-->
            <!--            </a-input>-->
            <a-select
              v-decorator="['degree', { rules: [{ required: true, message: '请输入产品度数！', whitespace: true }]}]"
              placeholder="请选择产品度数"
              style="width: 100%"
              @change="handleDegree"
              :getPopupContainer="triggerNode => triggerNode.parentNode"
            >
              <a-select-option v-for="(item,index) in degreeList" :key="item.crgdProductId" :value="item.degree">{{ item.degree }}</a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <div class="searchList" >
          <label for=""><small>*</small>数量</label>
          <a-form-item style="width: 100%" has-feedback>
            <a-input-number
              style="width: 100%"
              v-decorator="['qty', { rules: [{type: 'number', required: true,message: '请输入数量！', whitespace: true}]}]"
              placeholder="请输入数量"
              :min="1"
              @change="handleNum"
            />
          </a-form-item>
        </div>
        <div class="searchList" >
          <label for="">备注</label>
          <a-form-item style="width: 100%" has-feedback>
            <a-textarea
              v-decorator="['remark', { rules: [{ required: false}]}]"
              placeholder="请输入备注"
              :maxLength="200"
              :autosize="{ minRows: 2, maxRows: 6 }"
            />
          </a-form-item>
        </div>
        <span class="table-page-search-submitButtons">
          <a-button type="primary" @click="handleSubmit" size="small">确认</a-button>
          <a-button style="margin-left: 8px" @click="handleCancel" size="small">取消</a-button>
        </span>
      </div>
    </a-form>
  </a-spin>
</template>

<script>
import moment from 'moment'
import { getDegree, userDistRange } from '@/api/depot/wareHouse'
import { saveParamsFromStore } from '@/utils/storage'
import { findProductMo } from '@/api/basicInfo/hosData'
import { saveOrder, getCrgdPro } from '@/api/depot/order'
export default {
  name: 'AddNewAudit',
  props: ['editData'],
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.getFirst()
  },
  data () {
    // console.info('editData-====', this.editData)
    return {
      confirmLoading: false,
      form: this.$form.createForm(this),
      distList: [],
      typeList: [],
      proNoList: [],
      degreeList: [],
      distCode: undefined,
      productModel: '',
      isDist: false,
      productName: '',
      crgdProductId: '',
      remark: '',
      step: 0
    }
  },
  methods: {
    moment,
    handleSubmit (e) {
      e.preventDefault()
      const _that = this
      this.form.validateFieldsAndScroll((err, values) => {
        // console.info('this.proNum.validateStatus',_that.proNum.validateStatus)
        if (!err) {
          values.productModel = this.productModel
          values.productName = this.productName
          const params = {
            distCode: this.distCode,
            distName: this.distName,
            remark: values.remark,
            orderDetails: [{
              ...values,
              crgdProductId: this.crgdProductId
            }]
          }
          // console.info('params====', params)
          if (this.editData.type === 'add') {
            saveParamsFromStore(JSON.stringify(params), 'ORDERINFO')
            this.$emit('submit', params)
          } else {
            if (this.editData.rowkey) {
              params.orderDetails[0].rowkey = this.editData.rowkey
            }
            this.$emit('submit', params)
          }
          this.step = 0
        }
      })
    },
    handleCancel () {
      this.$emit('cancel', false)
    },
    getFirst () {
      userDistRange().then(res => {
        this.distList = res.data
        if (res.message === 'SUCCESS') {
          this.getProModel()
        }
      })
    },
    getProModel () {
      getCrgdPro().then(res => {
        if (res.message === 'SUCCESS') {
          const proMol = res.data
          proMol.map(item => {
            if (this.typeList.findIndex(list => list.productModel === item.productModel) === -1) {
              this.typeList.push(item)
            }
          })
          this.proNoList = proMol
          // this.typeList = proMol
          // console.info('======', this.typeList)
          if (this.editData.rowkey) {
            this.handleSelect(this.editData.productModel)
          }
        }
      })
      this.$nextTick(() => {
        if (this.editData.distCode) {
          this.distCode = this.editData.distCode
          this.distName = this.editData.distName
          this.isDist = true
          this.$nextTick(() => {
            setTimeout(() => {
              this.form.setFieldsValue({
                remark: this.editData.remark
              })
            })
          })
        }
        if (this.editData.rowkey) {
          this.productModel = this.editData.productModel
          this.productName = this.editData.productName
          this.$nextTick(() => {
            setTimeout(() => {
              this.form.setFieldsValue({
                crgdProductId: this.editData.crgdProductId,
                productModel: this.editData.productModel,
                degree: this.editData.degree,
                qty: this.editData.qty,
                remark: this.editData.remark
              })
            })
          })
        }
      })
    },
    handleDist (val) {
      // console.info('val===', val)
      this.distCode = val
      this.distList.map(item => {
        if (val === item.distCode) {
          this.distName = item.distName
        }
      })
    },
    handleDegree (val) {
      // console.info('val====', this.degreeList)
      this.degreeList.map(item => {
        if (item.degree === val) {
          this.crgdProductId = item.crgdProductId
        }
      })
      // console.info('this.crgdProductId----', this.crgdProductId)
    },
    handleNum (val) {
      return val > 0 ? val : 0
    },
    handleSelect (val) {
      // console.info('val----', val)
      this.degreeList = []
      this.proNoList.map(item => {
        if (item.productModel === val) {
          if (this.degreeList && this.degreeList.length > 0) {
            // console.info('-----')
            const degreeId = this.degreeList.findIndex(obj => obj.degree === item.degree)
            if (degreeId < 0) {
              this.degreeList.push(item)
            }
          } else {
            // console.info('2222')
            this.degreeList.push(item)
          }
          this.productModel = item.productModel
          this.productName = item.productName
        }
      })
      this.degreeList.sort((x, y) => parseFloat(x.degree) - parseFloat(y.degree))
      // console.info('this.degreeList===', this.degreeList)
      this.$nextTick(() => {
        this.$forceUpdate()
        if (this.editData.rowkey && this.step === 0) {
          this.form.setFieldsValue({
            degree: this.editData.degree
          })
          this.handleDegree(this.editData.degree)
          this.step = 1
        } else {
          this.form.setFieldsValue({
            degree: this.degreeList[0].degree
          })
          this.handleDegree(this.degreeList[0].degree)
        }
      })
      // console.info('this.degreeList=====', this.degreeList)
    },
  }
}
</script>
<style lang="less" scoped>
  .ant-form-inline .ant-form-item-with-help{
    margin: 0;
  }
  /* 搜索样式 */
  .searchWrap {
    .ant-select-selection--multiple {
      .ant-select-selection__rendered {
        ul {
          li {
            margin-top: 10px;
          }
        }
      }
    }

    .ant-drawer-content-wrapper {
      background: rgba(251, 251, 251, 1);
      box-shadow: -3px 0px 6px rgba(0, 4, 123, 0.2);

      .ant-drawer-content {
        background: rgba(251, 251, 251, 1);

        .ant-drawer-header {
          border: none;
          background: rgba(251, 251, 251, 1);
          font-size: 14px;
        }

        .ant-drawer-close {
          .anticon {
            color: rgba(148, 148, 148, 1);

            &:hover {
              color: rgba(62, 77, 168, 1);
            }
          }
        }

        .ant-drawer-body {
          padding: 0 24px 24px 24px;
          height: calc(100% - 54px);
          /*overflow-y: auto;*/

          .searchList {
            padding: 0 0 40px 0;
            label{
              small{
                color: red
              }
            }
            .ant-calendar-picker {
              width: 100%;
              max-width: none;
            }

            label {
              color: rgba(147, 147, 147, 1);
              font-size: 14px;
              line-height: 20px;
              margin: 0 0 8px 0;
              width: 100%;
              display: block;
            }

            .ant-input {
              border: 1px solid rgba(233, 233, 233, 1);
              border-radius: 4px;
              background: white;
              height: 44px;
              line-height: inherit;
            }

            .ant-input-disabled {
              cursor: pointer;
            }

            .ant-calendar-range-picker-separator {
              vertical-align: inherit;
            }

            .ant-form-item-control-wrapper {
              width: 100%;
            }
          }

          .ant-form {
            height: 100%;
            padding: 0 0 60px 0;

            .searchWrap {
              height: 100%;
              overflow-y: auto;

              .ant-form-item {
                width: 100%;
                margin-right: 0;
              }

              .ant-select-selection {
                background: #fff !important;
                border: 1px solid #ececec !important;

                .ant-select-selection__placeholder {
                  // color: #bfbfbf;
                }
              }

              .ant-select-selection--single {
                height: 42px;
                width: 100%;
              }

              .ant-select-selection__rendered {
                line-height: 42px;
              }

              .ant-select-dropdown-menu-item-active {
                background-color: #e6f7ff !important;
              }

              .adInput-input {
                .begin_date {
                  .anticon-calendar {
                    color: #3e4da8;
                  }
                }

                .ant-form-item,
                .ant-form-item-control-wrapper,
                .ant-form-item-control {
                  width: 100%;
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

            position: relative;

            .table-page-search-submitButtons {
              text-align: center;
              width: 100%;
              position: absolute;
              bottom: 0;
              left: 0;

              .ant-btn {
                width: 130px;
                height: 44px;
              }
            }
          }
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
  /deep/ .ant-select-selection--multiple .ant-select-search--inline{
    display: none;
  }
</style>

<template>
  <a-form layout="inline" :form="form">
    <div class="searchWrap">
      <a-row :gutter="48">
        <a-col :span="12">
          <div class="searchList">
            <label for>
              <small>*</small>产品型号
            </label>
            <a-form-item style="width: 100%" has-feedback>
              <a-select
                v-decorator="['addList.productModel', { rules: [{ required: true, message: '请选择产品型号！', whitespace: true }]}]"
                placeholder="请选择产品型号"
                style="width: 100%"
                @change="modalChange"
              >
                <a-select-option
                  v-for="(item,index) in modelList"
                  :key="index"
                  :value="item"
                >{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="searchList">
            <label for>产品名称</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-input
                style="width: 100%"
                placeholder="产品名称"
                class="productNameInput"
                v-model="addList.productName"
                disabled
              />
            </a-form-item>
          </div>
          <div class="searchList">
            <label for>产品分类</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-input
                placeholder="产品分类"
                class="productNameInput"
                v-model="addList.productCategory"
                disabled
              />
            </a-form-item>
          </div>
          <div class="searchList">
            <label for>自定义型号</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-input
                class="productNameInput"
                placeholder="自定义型号"
                v-model="addList.customModel"
                disabled
                style="width: 100%"
              />
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="searchList">
            <label for>自定义名称</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-input
                placeholder="自定义名称"
                class="productNameInput"
                v-model="addList.customName"
                disabled
                style="width: 100%"
              />
            </a-form-item>
          </div>
          <div class="searchList">
            <label for>单位</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-input
                placeholder="单位"
                class="productNameInput"
                v-model="addList.uom"
                disabled
                style="width: 100%"
              />
            </a-form-item>
          </div>
          <div class="searchList">
            <label for>
              <small>*</small>数量
            </label>
            <a-form-item
              style="width: 100%"
              :validate-status="proNum.validateStatus"
              :help="proNum.errorMsg"
              has-feedback
            >
              <span class="addManualProduct" v-if="negative">-</span>
              <a-input
                placeholder="请输入数量"
                @change="handleNumberChange"
                v-model="proNum.value"
                style="width: 100%"
              />
            </a-form-item>
          </div>
          <div class="searchList">
            <label for>
              <!--<small>*</small>-->
              单价
            </label>
            <a-form-item
              style="width: 100%"
              :validate-status="proPrice.validateStatus"
              :help="proPrice.errorMsg"
              has-feedback
            >
              <a-input
                placeholder="请输入单价"
                v-model="proPrice.value"
                style="width: 100%"
                @change="handleInput"
                :min="0"
              />
            </a-form-item>
          </div>
        </a-col>
      </a-row>
    </div>
    <span class="table-page-search-submitButtons">
      <a-button type="primary" @click="handleNoSub" size="small">添加</a-button>
      <a-button style="margin-left: 8px" @click="handleReset" size="small">重置</a-button>
    </span>
  </a-form>
</template>

<script>
import moment from 'moment'
import {
  invoiceDetailSearch
} from '@/api/auditManage/auditManage'
import {
  getDegree
} from '@/api/depot/wareHouse'

function validatePrimeNumber (number) {
  const reg = /^(0|[1-9][0-9]*)$/
  if (reg.test(number)) {
    return {
      validateStatus: 'success',
      errorMsg: null
    }
  }
  return {
    validateStatus: 'error',
    errorMsg: '请输入正整数'
  }
}

function validatePrimePrice (number) {
  const reg = /^(0|[1-9][0-9]*)+(\.[0-9]{1,7})?$/
  if (reg.test(number)) {
    return {
      validateStatus: 'success',
      errorMsg: null
    }
  } else if (number === '') {
    return {
      validateStatus: 'success',
      errorMsg: null
    }
  }
  return {
    validateStatus: 'error',
    errorMsg: '单价类型不正确'
  }
}
export default {
  name: 'AddProductManual',
  props: ['selectedProduct'],
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  data () {
    return {
      modelList: [],
      degreeList: [],
      productName: [],
      proNum: {
        value: 1,
        validateStatus: 'success'
      },
      proPrice: {
        value: 0,
        validateStatus: 'success'
      },
      negative: false,
      addList: {
        productModel: '',
        productName: '',
        productCategory: '',
        customModel: '',
        customName: '',
        degree: '',
        tax: '',
        uom: '',
        qty: '',
        nonePrice: ''
      }
    }
  },
  created () {
    this.getProductModal()
  },
  methods: {
    moment,
    getProductModal () { // 获取型号数据和名称数据
      this.modelList = []
      this.productName = []
      if (this.selectedProduct.inStatus === '1' || this.selectedProduct.docType === '11') {
        this.negative = false
      } else {
        this.negative = true
      }
      const param = {
        docFlag: 0,
        distCode: this.selectedProduct.distCode
      }
      invoiceDetailSearch(param).then(res => {
        if (res.code === 200) {
          // console.info('res===', res)
          if (res.data.list.length > 0) {
            const current = res.data.list
            for (let i = 0; i < current.length; i++) {
              if (current[i].productModel !== 'EMERALDC' && current[i].productModel !== '1MTEC30' && current[i].productModel !== 'HEALON') {
                this.modelList.push(current[i].productModel)
              }
              this.productName.push(current[i])
            }
          }
        }
      })
    },
    getDegreeList (value) { // 获取度数
      this.form.setFieldsValue({
        'addList.degree': undefined
      })
      const param = {
        productModel: value
      }
      this.degreeList = []
      getDegree(param).then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            this.degreeList = res.data
            console.log(this.degreeList)
          }
        }
      })
    },
    modalChange (value) { // 选择产品型号
      this.productName.forEach(item => {
        if (item.productModel === value) {
          this.addList = item
          this.proNum.value = item.qty
          this.proPrice.value = item.nonePrice
        }
      })
    },
    handleNumberChange () {
      const value = this.proNum.value
      const json = validatePrimeNumber(value)
      this.proNum = {
        errorMsg: json.errorMsg,
        validateStatus: json.validateStatus,
        value: value
      }
      if (value !== '0') {
        if (this.selectedProduct.inStatus === '1') {
          this.negative = false
        } else {
          this.negative = true
        }
      } else {
        this.negative = false
      }
    },
    handleReset () {
      this.form.setFieldsValue({
        'addList.productModel': undefined
      })
      this.proNum.value = 1
      this.proPrice.value = 0
      this.addList.productName = ''
      this.addList.productCategory = ''
      this.addList.customModel = ''
      this.addList.customName = ''
      this.addList.tax = ''
      this.addList.uom = ''
    },
    handleNoSub (e) {
      e.preventDefault()
      const _that = this
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err && _that.proNum.validateStatus === 'success' && _that.proPrice.validateStatus === 'success') {
          console.log(values)
          _that.addList.productModel = values.addList.productModel
          // _that.addList.degree = values.addList.degree;
          _that.addList.qty = _that.proNum.value
          _that.addList.nonePrice = _that.proPrice.value
          const arr = []
          arr.push(_that.addList)
          this.$emit('selectedData', arr)
        }
      })
    },
    handleInput () {
      const value = this.proPrice.value
      const json = validatePrimePrice(value)
      this.proPrice = {
        errorMsg: json.errorMsg,
        validateStatus: json.validateStatus,
        value: value
      }
    }
  }
}
</script>

<style lang="less" scoped>
.addManualProduct {
  position: absolute;
  left: 4px;
  z-index: 99;
}

.searchWrap {
  overflow-x: hidden;

  .ant-form-item-control,
  .ant-form-item-control-wrapper {
    width: 100%;
  }

  .searchList {
    small {
      color: #e17877;
      font-size: 14px;
      padding: 0 4px 0 0;
    }

    .ant-input-disabled {
      background: #ececec !important;
      color: #c1c1c1 !important;
      opacity: 1 !important;
    }
  }
}

.ant-form-inline .ant-form-item-with-help {
  margin-bottom: 0;
}

.productNameInput {
  cursor: not-allowed !important;
  color: rgba(0, 0, 0, 0.65);
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
</style>

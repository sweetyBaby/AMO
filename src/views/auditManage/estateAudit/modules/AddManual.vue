<template>

  <a-form layout="inline" :form="form">
    <div class="searchWrap">
      <a-row :gutter="48">
        <a-col :span="12">
          <div class="searchList">
            <label for=""><small>*</small>产品型号</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-select
                v-decorator="['addList.productModel', { rules: [{ required: true, message: '请选择产品型号！', whitespace: true }]}]"
                placeholder="请选择产品型号"
                style="width: 100%"
                @change="modalChange"
              >
                <a-select-option v-for="(item,index) in modelList" :key="index" :value="item">{{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="searchList">
            <label for="">产品名称</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-input
                placeholder="产品名称"
                class="productNameInput"
                v-model="addList.productName"
                disabled
              />
            </a-form-item>
          </div>
          <div class="searchList">
            <label for="">产品分类</label>
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
            <label for="">自定义型号</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-input
                class="productNameInput"
                placeholder="自定义型号"
                v-model="addList.customModel"
                disabled
              />
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="searchList">
            <label for="">自定义名称</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-input
                placeholder="自定义名称"
                class="productNameInput"
                v-model="addList.customName"
                disabled
              />
            </a-form-item>
          </div>
          <div class="searchList">
            <label for="">单位</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-input
                placeholder="单位"
                class="productNameInput"
                v-model="addList.uom"
                disabled
              />
            </a-form-item>
          </div>
          <div class="searchList">
            <label for=""><small>*</small>数量</label>
            <a-form-item
              style="width: 100%"
              :validate-status="proNum.validateStatus"
              :help="proNum.errorMsg"
              has-feedback
            >
              <span class="addManualProduct" v-if="negative">-</span>
              <a-input
                style="width: 100%"
                placeholder="请输入数量"
                @change="handleNumberChange"
                v-model="proNum.value"
              />
            </a-form-item>
          </div>
          <div class="searchList">
            <label for=""><!--<small>*</small>-->单价</label>
            <a-form-item
              style="width: 100%"
              :validate-status="proPrice.validateStatus"
              :help="proPrice.errorMsg"
              has-feedback>
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
    <span class="search-submitButtons">
      <a-button type="primary" @click="handleNoSub" size="small">添加</a-button>
      <a-button style="margin-left: 8px" @click="handleReset" size="small">重置</a-button>
    </span>
  </a-form>
</template>

<script>
import moment from 'moment'
import { invoiceDetailSearch } from '@/api/auditManage/auditManage'
import { getDegree } from '@/api/depot/wareHouse'

function validatePrimeNumber (number) {
  const reg = /^(0|[1-9][0-9]*)$/
  if (reg.test(number)) {
    return {
      validateStatus: 'success',
      errorMsg: null,
    }
  }
  return {
    validateStatus: 'error',
    errorMsg: '请输入数量',
  }
}

function validatePrimePrice (number) {
  const reg = /^(0|[1-9][0-9]*)+(\.[0-9]{1,7})?$/
  if (reg.test(number)) {
    return {
      validateStatus: 'success',
      errorMsg: null,
    }
  } else if (number === '') {
    return {
      validateStatus: 'success',
      errorMsg: null,
    }
  }
  return {
    validateStatus: 'error',
    errorMsg: '单价类型不正确',
  }
}

export default {
  name: 'AddManual',
  props: ['selectedProduct'],
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
  },
  data () {
    return {
      modelList: [],
      degreeList: [],
      productName: [],
      proNum: {
        value: 1,
        validateStatus: 'success',
      },
      proPrice: {
        value: 0,
        validateStatus: 'success',
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
      },
      isShowSearch: false
    }
  },
  created () {
    this.getProductModal()
  },
  methods: {
    moment,
    getProductModal () { // 获取型号数据和名称数据
      const InvoiceId = JSON.parse(window.localStorage.getItem('EstateId'))
      this.modelList = []
      this.productName = []
      if (InvoiceId.inStatus === '1') {
        this.negative = false
      } else {
        this.negative = true
      }
      const param = {
        docFlag: 0,
        distCode: InvoiceId.distCode
      }
      invoiceDetailSearch(param).then(res => {
        if (res.code === 200) {
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
        'addList.degree': undefined,
      })
      const param = {
        productModel: value
      }
      this.degreeList = []
      getDegree(param).then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            this.degreeList = res.data
            // console.log(this.degreeList)
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
        const InvoiceId = JSON.parse(window.localStorage.getItem('EstateId'))
        if (InvoiceId.inStatus === '1') {
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
        'addList.productModel': undefined,
      })
      this.proNum.value = 1
      this.proPrice.value = 0
      this.addList = {
        productName: '',
        productCategory: '',
        customModel: '',
        customName: '',
        tax: '',
        uom: ''
      }
    },
    handleNoSub (e) {
      e.preventDefault()
      const _that = this
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err && _that.proNum.validateStatus === 'success' && _that.proPrice.validateStatus === 'success') {
          // console.log(values)
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
    },
    onSearchClose () {
      // 关闭手动添加
      this.$emit('close')
    },
  }
}
</script>

<style lang="less" scoped>
  .searchList {
    padding-bottom: 40px;

    .ant-input {
      border: 1px solid #e9e9e9;
      border-radius: 4px;
      background: #fff;
      height: 44px;
      line-height: inherit;

      &-disabled {
        background: #ececec !important;
        color: #c1c1c1 !important;
        opacity: 1 !important;
      }
    }
  }

  .searchWrap {
    :global {
      /deep/ .ant-drawer-body .ant-form {
        height: 100%;
        padding: 0 0 60px 0;
        position: relative;

      }
    }
  }

  .search-submitButtons {
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

  .addManualProduct {
    position: absolute;
    left: 4px;
    z-index: 99;
  }

  .searchWrap {
    overflow-x: hidden;

    .ant-form-item-control, .ant-form-item-control-wrapper {
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
    margin-bottom: 0
  }

  .productNameInput {
    cursor: not-allowed !important;
    color: rgba(0, 0, 0, 0.65);
  }
</style>

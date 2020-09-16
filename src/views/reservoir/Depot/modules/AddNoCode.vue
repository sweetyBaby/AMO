<template>
  <a-form layout="inline" :form="form">
    <div class="searchWrap">
      <a-row :gutter="48">
        <a-col :span="12">
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
                <a-select-option v-for="(item,index) in typeList" :key="index" :value="item">{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12" v-show="isSpecial">
          <div class="searchList">
            <label for=""><small>*</small>产品批号
            <a-tooltip placement="top">
              <template slot="title">
                <span>默认列表显示匹配结果前200条数据，可输入更多字段精确匹配。</span>
              </template>
              <i class="iconfont icon-tips"></i>
            </a-tooltip>
            </label>
            <a-form-item style="width: 100%" has-feedback>
              <a-auto-complete
                v-decorator="['batchNumber', { rules: [{ required: true, message: '请输入产品批号！', whitespace: true }]}]"
                style="width: 100%;"
                :dataSource="batchList"
                placeholder="输入或选择产品批号"
                @change="handleBatch"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                @search="handleSearch"
              />
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12" v-if="isDegree">
          <div class="searchList">
            <label for=""><small>*</small>产品度数</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-select
                v-decorator="['degree', { rules: [{ required: true, message: '请输入产品度数！', whitespace: true }]}]"
                placeholder="请选择产品度数"
                style="width: 100%"
                @change="handleDegree"
              >
                <a-select-option
                  v-for="item in dgreeList"
                  :key="item.id"
                  :value="item.degree"
                >{{ item.degree === '1000.0' ? '未知度数' : item.degree }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="searchList">
            <label for=""><small>*</small>销售单位</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-select
                v-decorator="['uom', { rules: [{ required: true, message: '请选择销售单位！', whitespace: true }]}]"
                placeholder="请选择销售单位"
                style="width: 100%"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
              >
                <a-select-option
                  v-for=" (item,index) in unitList"
                  :value="item"
                  :key="index"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12" v-if="!isDelivery && !isReplace">
          <div class="searchList">
            <label for=""><small>*</small>库位名称</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-select
                v-decorator="['whCode', { rules: [{ required: true, message: '请选择库位名称！', whitespace: true }]}]"
                placeholder="请选择库位名称"
                style="width: 100%"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                @change="handleWhChange"
                showSearch
                optionFilterProp="children"
              >
                <a-select-option
                  v-for=" (item,index) in whList"
                  :value="item.whCode"
                  :key="index"
                >
                  {{ item.whName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="searchList">
            <label for=""><small>*</small>产品数量</label>
            <a-form-item
              style="width: 100%"
              :validate-status="proNum.validateStatus"
              :help="proNum.errorMsg"
            >
              <a-input-number
                style="width: 100%"
                :value="proNum.value"
                :min="1"
                @change="handleNumberChange"
              />
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="searchList">
            <label for="">不含税单价</label>
            <a-form-item style="width: 100%">
              <a-input-number
                v-model="proPrice"
                placeholder="不含税单价"
                style="width: 100%"
                @blur="handleInput"
                :min="0"
              />
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12" v-show="isSpecial">
          <div class="searchList">
            <label for=""><small>*</small>生产日期</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-date-picker
                v-decorator="['effectiveDateBegin', { rules: [{type:'object', required: true, message: '请选择生产日期！', whitespace: true }]}]"
                @change="selectCreTime"
                :disabledDate="disabledDate"
                format="YYYY-MM-DD"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
              ></a-date-picker>
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12" v-show="isSpecial">
          <div class="searchList">
            <label for=""><small>*</small>失效日期 &nbsp;</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-date-picker
                v-decorator="['effectiveDateEnd', { rules: [{type:'object', required: true, message: '请选择失效日期！', whitespace: true }]}]"
                :disabledDate="disabledEndDate"
                format="YYYY-MM-DD"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
              ></a-date-picker>
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="searchList">
            <label for=""><small>*</small>注册证号</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-select
                v-decorator="['registration', { rules: [{ required: true, message: '请选择注册证号！', whitespace: true }]}]"
                placeholder="请选择注册证号"
                style="width: 100%"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
              >
                <a-select-option
                  v-for="(item ,index ) in scodeList"
                  :value="item.registration"
                  :key="index"

                >{{ item.registration }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12" v-if="(!isDelivery && !isModel) || isEstate">
          <div class="searchList" >
            <label for=""><small>*</small>无码出入库理由</label>
            <a-form-item style="width: 100%" has-feedback>
              <a-textarea
                v-decorator="['reason', { rules: [{ required: true, message: '请输入无码出入库理由！', whitespace: true }]}]"
                placeholder="请输入无码出入库理由"
                :autosize="{ minRows: 2, maxRows: 6 }"
                @change="handleReason"
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
import proMolList from './proMolList'
import { findProductMo } from '@/api/basicInfo/hosData'
import { getProductBatch, getDegree, initProductNone, getRegistration, getProductBatchInfo, getDocumentWhList } from '@/api/depot/wareHouse'
function validatePrimeNumber (number) {
  if (number > 0) {
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
export default {
  name: 'AddNoCode',
  props: ['delivery', 'deliveryData'],
  components: {
    proMolList
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    console.info('deliveryData====', this.deliveryData)
    this.getProModel()
    if (this.delivery === 'delivery' || this.delivery === 'replace') {
      this.isDelivery = false
    }
    // if (this.deliveryData.docType === '02' && this.deliveryData.whType === 3) {
    if (this.deliveryData.docType === '02') {
      this.isEstate = true
    } else {
      this.isEstate = false
    }
  },
  data () {
    return {
      queryParam: {},
      proNum: {
        value: 1,
        validateStatus: 'success'
      },
      isMolData: {
        visible: false
      },
      scodeList: [],
      typeList: [],
      serialList: [],
      batchList: [],
      allBatchList: [],
      dgreeList: [],
      unitList: [],
      startTime: null,
      proNameCn: '',
      proModle: '',
      isDegree: true,
      productName: '',
      proNoList: [],
      isModel: false,
      isEstate: false, // 三产退货入库 无码出库理由
      isHEALON: false,
      isDelivery: true,
      whName: '',
      whType: '',
      whList: [],
      whCode: undefined,
      proPrice: '',
      proReason: '',
      proBatchNumber: '',
      isSpecial: true,
      timer: null,
      currentModel: '', // 已选型号
      isReplace: false
    }
  },
  methods: {
    moment,
    handleWhChange (val) {
      this.whCode = val
      // 获取库位名称
      if (!this.isDelivery) {
        this.whList.map(item => {
          if (item.whCode === val) {
            // console.info('itemthis.proModle---',this.proModle)
            this.whName = item.whName
            this.whType = item.whType.toString()
            if (this.whType === '3' && !this.isDelivery) {
              this.isModel = true
            } else if (this.whType !== '3' && this.proModle !== 'EMERALDC' && this.proModle !== '1MTEC30' && this.proModle !== 'HEALON') {
              this.isModel = false
              const _that = this
              this.$nextTick(() => {
                // console.info('pppp',this.proReason)
                _that.form.setFieldsValue({
                  reason: this.proReason
                })
              })
            }
          }
        })
      }
    },
    handleSelect (val) {
      this.isSpecial = true
      this.proModle = val
      this.getModelChange(val)
      this.getInfors(val)
    },
    getModelChange (val) {
      const _that = this
      if (val === 'EMERALDC' || val === '1MTEC30') {
        // console.info('---',this.whCode)
        this.unitList = ['盒', '个']
        this.isDegree = false
        setTimeout(() => {
          _that.form.setFieldsValue({
            uom: '盒'
          })
        }, 500)
        if (!this.isDelivery) {
          this.isModel = true
          this.isHEALON = false
          setTimeout(() => {
            _that.form.setFieldsValue({
              whCode: _that.whCode
            })
          }, 500)
        }
      } else if (val === 'HEALON') {
        this.unitList = ['盒']
        this.isDegree = false
        setTimeout(() => {
          _that.form.setFieldsValue({
            uom: '盒'
          })
        }, 500)
        if (!this.isDelivery) {
          this.isModel = true
          this.$nextTick(() => {
            this.form.setFieldsValue({
              whCode: _that.whCode
            })
          })
        }
      } else {
        this.unitList = ['盒']
        this.isDegree = true
        setTimeout(() => {
          _that.form.setFieldsValue({
            uom: '盒'
          })
        }, 500)
        if (!this.isDelivery) {
          if (this.whType !== '3') {
            this.isModel = false
            this.$nextTick(() => {
              _that.form.setFieldsValue({
                reason: _that.proReason
              })
            })
          } else {
            this.isModel = true
          }
          this.$nextTick(() => {
            this.form.setFieldsValue({
              whCode: _that.whCode
            })
          })
        }
      }
    },
    getInfors (val, degreeVal, bantchNum) {
      // console.info('degreeVal=====',degreeVal)
      const params = {
        'productModel': this.proModle
      }
      // 获取对应产品名称
      this.proNoList.map((item) => {
        if (item.productModel === val) {
          // console.info('item---',item)
          this.productName = item.productName
        }
      })
      // 获取度数列表
      if (this.isDegree && !degreeVal) {
        getDegree(params).then(res => {
          this.dgreeList = res.data
          this.form.setFieldsValue({
            degree: res.data.length > 0 ? res.data[0].degree : undefined
          })
        })
      } else if (degreeVal) {
        this.form.setFieldsValue({
          degree: degreeVal
        })
      }
      // 设置库位名称
      this.getProductBatch(params, bantchNum)

      // this.getInitProduct(params)
    },
    getProductBatch (params, bantchNum) {
      // console.info('bantchNum=====',bantchNum)
      if (bantchNum) {
        this.form.setFieldsValue({
          batchNumber: bantchNum
        })
      } else {
        // 获取批号列表
        getProductBatch(params).then(res => {
          // console.log({res})
          if (res.message === 'SUCCESS') {
            this.serialList = res.data
            // console.info('this.serialList----',this.batchList)
            const batchData = res.data.map(item => item.batchNumber)
            this.batchList = batchData.length > 200 ? batchData.splice(0, 199) : batchData
            this.allBatchList = batchData
            // console.log(this.batchList)
            this.form.setFieldsValue({
              batchNumber: res.data[0].batchNumber
            })

            if (res.data[0].batchNumber) {
              this.handleBatch(res.data[0].batchNumber)
            }
          } else {
            this.serialList = []
            this.batchList = []
            this.allBatchList = []
            this.form.setFieldsValue({
              batchNumber: undefined,
              effectiveDateBegin: null,
              effectiveDateEnd: null
            })
          }
        })
      }

      // 获取注册证号
      getRegistration(params).then(response => {
        if (response.message === 'SUCCESS') {
          // console.info('registration',response)
          this.scodeList = response.data
          this.form.setFieldsValue({
            registration: response.data.length > 0 ? response.data[0].registration : undefined
          })
        }
      })
    },
    filterOption (input, option) {
      // console.info('option',option)
      clearTimeout(this.timer)
      // this.timer = null
      this.timer = setTimeout(() => {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      }, 300)
    },
    handleBatch (val) {
      // console.info('val---',this.isDegree)
      this.proBatchNumber = val
      // 获取生产日期，失效日期
      let dataBegin = null
      let dataEnd = null
      this.serialList.map(item => {
        if (item.batchNumber === val) {
          dataBegin = item.effectiveDateBegin
          dataEnd = item.effectiveDateEnd
        }
      })

      // console.info('dataEnd---',dataBegin,dataEnd)
      if (dataBegin !== null && dataEnd !== null) {
        // 延迟赋值，防止加载太快报warning
        setTimeout(() => {
          this.form.setFieldsValue({
            effectiveDateBegin: moment(dataBegin, 'YYYY-MM-DD'),
            effectiveDateEnd: moment(dataEnd, 'YYYY-MM-DD')
          })
        }, 100)
      } else {
        this.form.setFieldsValue({
          effectiveDateBegin: null,
          effectiveDateEnd: null
        })
      }
    },
    // 度数切换
    handleDegree (val) {
      // console.info('this.batchNumber',this.proBatchNumber)
      if (val === '1000.0') {
        this.isSpecial = false
      } else {
        this.isSpecial = true
        this.getModelChange(this.proModle)
        this.getInfors(this.proModle, val, this.proBatchNumber)
      }
    },
    handleUser (val) {
      this.proWrap.cusChange = val
    },
    filterOption (input, option) {
      // console.info('option',option)
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleSearch (value) {
      // console.info(value, this.allBatchList)
      const newList = []
      this.allBatchList.forEach(item => {
        if (item.indexOf(value) > -1) {
          newList.push(item)
        }
      })
      // console.info('newList=====', newList)
      this.batchList = newList.length > 200 ? newList.splice(0, 199) : newList
    },
    changeNum (num) {
      console.info('val', num)
    },
    selectCreTime (moment, val) {
      // console.info('val',moment,val)
      this.startTime = moment
    },
    handleNumberChange (value) {
      // console.info('value---',value)
      if (!/^\d+$/.test(value)) {
        value = Number(value.toString().replace(/[^\d]/g, ''))
      }
      this.proNum = {
        ...validatePrimeNumber(value),
        value
      }
    },
    disabledDate (current) {
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
    handleClose () {
      this.isMolData.visible = false
    },
    getProModel () {
      const params = {
        'productModel': ''
      }
      findProductMo(params).then(res => {
        // console.info('res',res)
        const proMol = res.data
        this.proNoList = proMol
        proMol.map((item) => {
          if (this.typeList.findIndex(item => item === item.productModel) < 0) {
            this.typeList.push(item.productModel)
          }
        })
      })
      if (this.deliveryData.distCode) {
        const query = {
          distCode: this.deliveryData.distCode,
          docType: this.deliveryData.docType
        }
        console.info('delivery=--==', this.delivery)
        getDocumentWhList(query).then(res => {
          // console.info('res.data---',res.data)
          if (this.deliveryData.wareType && this.delivery !== 'replace') {
            if (this.delivery === 'delivery') {
              this.whList = res.data.whList.filter(item => (item.whType === 1 || item.whType === 3))
            } else {
              this.whList = res.data.whList.filter(item => item.whType === 1)
            }
          } else if (this.delivery === 'replace') {
            this.isReplace = true
            // this.whList = res.data.whList.filter( item => item.whType === 4)
            this.form.setFieldsValue({
              whCode: res.data.whList.filter(item => item.whType === 4)[0].whCode
            })
          } else {
            this.whList = res.data.whList
          }
        })
      }
    },
    handleReason (val) {
      this.proReason = val.target.value
    },
    handleReset () {
      this.form.setFieldsValue({
        productModel: undefined,
        batchNumber: '',
        degree: undefined,
        uom: undefined,
        proPrice: undefined,
        effectiveDateBegin: null,
        effectiveDateEnd: null,
        registration: undefined,
        whCode: undefined
      })
      this.proNum.value = 1
      this.proPrice = ''
      if (!this.isDelivery) {
        this.form.setFieldsValue({
          reason: ''
        })
      }
    },
    handleNoSub (e) {
      e.preventDefault()
      const _that = this

      this.form.validateFieldsAndScroll((err, values) => {
        // console.info('this.proNum.validateStatus',_that.proNum.validateStatus)
        if (!err && _that.proNum.validateStatus === 'success') {
          if (!this.isDelivery && this.whType === '3') {
            values.reason = ''
          }
          if (values.degree === '1000.0') {
            values.batchNumber = ''
            values.effectiveDateBegin = null
            values.effectiveDateEnd = null
          } else {
            values.effectiveDateBegin = moment(values.effectiveDateBegin).format('YYYY-MM-DD')
            values.effectiveDateEnd = moment(values.effectiveDateEnd).format('YYYY-MM-DD')
          }
          values.qty = this.proNum.value
          values.productName = this.productName
          values.whName = this.whName
          values.price = this.proPrice
          values.whType = this.whType
          // console.info('values----',values)
          this.$emit('hasNoSub', values)
        }
      })
    },
    handleInput (val) {
      const inputValF = parseFloat(val.target.value)
      if (isNaN(inputValF) || inputValF < 0) {
        this.proPrice = ''
      } else {
        const inputVal = inputValF.toString()
        if (inputVal.indexOf('.')) {
          this.proPrice = parseFloat(inputVal.match(/^\d*(\.?\d{0,2})/g)[0]).toFixed(2)
        }
      }
    },
    getInitProduct (params) {
      initProductNone(params).then(res => {
        this.scodeList = res.data.registrationList
        // this.unitList = res.data.unitList
      })
    }
  },
  watch: {
    deliveryData: {
      handler (newVal, oldVal) {
        console.info('newVal', newVal)
      }
    }
  }
}
</script>

<style lang="less">
  .searchWrap{
    overflow-x: hidden;
    .ant-row{
      display: flex;
      flex-wrap: wrap;
    }
    .ant-form-item-control,.ant-form-item-control-wrapper{
      width: 100%;
    }
    .ant-select{
      height: 44px;
    }
  }
  .ant-form-inline .ant-form-item-with-help{
    margin-bottom:0
  }
  .searchWrap .ant-drawer-content-wrapper .ant-drawer-content .ant-drawer-body .searchList .ant-select-auto-complete .ant-input{
    background: none;
    border:none;
  }

  /*详情基本信息*/
  .basicBorder {
    border: 1px solid rgba(233, 233, 233, 1);
    overflow: hidden;
    background: rgba(251, 251, 251, 1);
    > .ant-row {
      > div {
        display: flex;
        flex-wrap: nowrap;
        height: 56px;
        border-bottom: 1px solid rgba(233, 233, 233, 1);
        padding: 0 !important;
        label.basicTitle {
          width: 30%;
          flex-grow: 1;
          background: rgba(251, 251, 251, 1);
          text-align: right;
          line-height: 56px;
          padding: 0 12px;
          display: inline-block;
          color: rgba(52, 53, 62, 1);
          small{
            color: red;
            padding: 0 4px 0 0;
          }
        }
        .basicInfo {
          flex-grow: 1;
          width: 70%;
          border-left: 1px solid rgba(233, 233, 233, 1);
          border-right: 1px solid rgba(233, 233, 233, 1);
          display: inline-block;
          padding: 12px;
          color: rgba(52, 53, 62, 1);
          &:nth-child(3n) {
            border-right: none;
          }
          .basicBase {
            line-height: 32px;
          }
        }
      }
    }
    .ant-input,
    .ant-select-selection {
      background: white;
      border: 1px solid rgba(233, 233, 233, 1);
      border-radius: 4px;
    }
  }

  .searchWrap{
    .ant-drawer-content-wrapper{
      background:rgba(251,251,251,1);
      box-shadow:-3px 0px 6px rgba(0,4,123,0.2);
      .ant-drawer-content{
        background:rgba(251,251,251,1);
        .ant-drawer-header{
          border: none;
          background:rgba(251,251,251,1);
          font-size: 14px;
        }
        .ant-drawer-close{
          .anticon{
            color: rgba(148, 148, 148, 1);
            &:hover{
              color: rgba(62, 77, 168, 1);
            }
          }
        }
        .ant-drawer-body{
          padding: 0 24px 24px 24px;
          height: calc(100% - 54px);
          /*overflow-y: auto;*/
          .searchList{
            padding: 0 0 32px 0;
            label{
              color: rgba(147, 147, 147, 1);
              font-size: 14px;
              line-height: 20px;
              margin: 0 0 8px 0;
              width: 100%;
              display: block;
              small{
                color: rgba(225, 120, 119, 1);
                font-size: 14px;
                padding: 0 4px 0 0;
              }
            }
            .ant-calendar-picker{
              max-width: inherit;
            }
            .ant-input{
              border:1px solid rgba(233,233,233,1);
              border-radius: 4px;
              background: white;
              height: 44px;
              line-height: 44px;
              &.ant-calendar-picker-input{
                line-height: 36px;
              }
            }
            .ant-select-selection{
              height: 44px;
              line-height: 44px;
              .ant-select-selection__rendered{
                line-height: 44px;
              }
            }
            .ant-input-number{
              height: 44px;
              line-height: 44px;
            }
          }
          .ant-form{
            height:  100%;
            padding: 0 0 60px 0;
            .searchWrap{
              height:  100%;
              overflow-y: auto;
            }
            position: relative;
            .table-page-search-submitButtons{
              text-align: center;
              width: 100%;
              position: absolute;
              bottom: 0;
              left: 0;
              .ant-btn{
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

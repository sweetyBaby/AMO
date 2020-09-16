<template>
  <a-modal
    title="编辑"
    :width="800"
    :visible="editData.visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :destroyOnClose="true"
    class="editScan"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <div class="scanEdit">
        <div class="scanLeft">
          <a-form layout="inline" :form="form">
            <div class="scanMain">
              <label for="">产品名称</label>
              <div class="scanDetail">
                <span class="scanCon">{{ proData.productName }}</span>
              </div>
            </div>
            <div class="scanBorder"></div>
            <div class="scanMain">
              <a-row :gutter="24">
                <a-col :span="12">
                  <label for="">产品型号</label>
                  <div class="scanDetail">
                    <span class="scanCon">{{ proData.productModel }}</span>
                  </div>
                </a-col>
                <a-col :span="12">
                  <label for="">度数</label>
                  <div class="scanDetail">
                    <span class="scanCon">{{ proData.degree === '1000.0' ? '未知度数' : proData.degree }}</span>
                  </div>
                </a-col>
              </a-row>
            </div>
            <div class="scanBorder" v-show=" proData.degree !== '1000.0'"></div>
            <div class="scanMain" v-show=" proData.degree !== '1000.0'">
              <label for=""><small>*</small>产品批号</label>
              <div class="scanDetail">
                <a-form-item
                  style="width: 100%"
                  :validate-status="proNum.validateStatus"
                  :help="proNum.errorMsg"
                >
                  <a-input
                    style="width: 100%"
                    :value="proData.batchNumber"
                    :min="1"
                    @change="handleNumberChange"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="scanBorder"></div>
            <div class="scanMain">
              <a-row :gutter="24">
                <a-col :span="12">
                  <label for="">数量</label>
                  <div class="scanDetail">
                    <a-input-number
                      :min="1"
                      v-model="proData.qty"
                      style="width: 100%"
                      @change="changeNum"
                      :disabled="isSn"
                    />
                  </div>
                </a-col>
                <a-col :span="12">
                  <label for="">单位</label>
                  <div class="scanDetail">
                    <a-form-item style="width: 100%" has-feedback>
                      <a-select
                        v-model="proData.uom"
                        placeholder="请选择单位"
                        style="width: 100%"
                        @change="handleSelect"
                        :getPopupContainer="triggerNode => triggerNode.parentNode"
                      >
                        <a-select-option v-for="(item,index) in unitList" :key="index" :value="item">{{ item }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </div>
                </a-col>
              </a-row>
            </div>
            <div class="scanBorder"></div>
            <div class="scanMain" v-if="(isdelivery && proData.force) || (isdelivery && !proData.serialNumber && !isReplace) || (isAllot && proData.force)">
              <a-row :gutter="24">
                <a-col :span="12">
                  <label for=""><small>*</small>选择库位名称</label>
                  <div class="scanDetail">
                    <a-form-item
                      style="width: 100%"
                      :validate-status="proWhChange.validateStatus"
                      :help="proWhChange.errorMsg">
                      <a-select
                        v-model="proData.whCode"
                        placeholder="请选择库位名称"
                        style="width: 100%"
                        @change="handleChangeWh"
                        :getPopupContainer="triggerNode => triggerNode.parentNode"
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
                  <label for="">价格</label>
                  <div class="scanDetail">
                    <a-input-number
                      v-model="proData.price"
                      placeholder="请输入价格"
                      style="width: 100%"
                      :min="0"
                      @blur="handleInput"
                    />
                  </div>
                </a-col>
              </a-row>
            </div>
            <div class="scanMain" v-if="(isAllot && !proData.force) || (isdelivery && !proData.force && proData.serialNumber) || isReplace">
              <a-row :gutter="24">
                <a-col :span="12">
                  <label for=""><small>*</small>库位名称</label>
                  <div class="scanDetail">
                    <span class="scanCon">{{ proData.whName }}</span>
                  </div>
                </a-col>
                <a-col :span="12">
                  <label for="">价格</label>
                  <div class="scanDetail">
                    <a-input-number
                      v-model="proData.price"
                      placeholder="请输入价格"
                      style="width: 100%"
                      :min="0"
                      @blur="handleInput"
                    />
                  </div>
                </a-col>
              </a-row>
            </div>
            <div class="scanMain" v-if="!isdelivery && !isAllot">
              <label for="">价格</label>
              <div class="scanDetail">
                <a-input-number
                  v-model="proData.price"
                  placeholder="请输入价格"
                  style="width: 100%"
                  :min="0"
                  @blur="handleInput"
                />
              </div>
            </div>
            <div class="scanBorder" v-show=" proData.degree !== '1000.0'"></div>
            <div class="scanMain" v-show=" proData.degree !== '1000.0'">
              <a-row :gutter="24">
                <a-col :span="12">
                  <label for="">生产日期</label>
                  <div class="scanDetail">
                    <a-date-picker
                      @change="onChangeStart"
                      v-model="startTime"
                      :format="dateFormat"
                      :disabledDate="disabledStartDate"
                    >
                    </a-date-picker>
                  </div>
                </a-col>
                <a-col :span="12">
                  <label for="">失效日期</label>
                  <div class="scanDetail">
                    <a-date-picker
                      @change="onChangeEnd"
                      v-model="endTime"
                      :format="dateFormat"
                      :disabledDate="disabledEndDate"
                    ></a-date-picker>
                  </div>
                </a-col>
              </a-row>
            </div>
            <div class="scanBorder"></div>
            <div class="scanMain">
              <label for="">注册证编号</label>
              <div class="scanDetail">
                <a-form-item style="width: 100%" has-feedback>
                  <a-select
                    v-model="proData.registration"
                    placeholder="请选择注册证编号"
                    style="width: 100%"
                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                  >
                    <a-select-option
                      v-for=" (item,index) in scodeList"
                      :value="item.registration"
                      :key="index"
                    >
                      {{ item.registration }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="scanBorder" v-if="(!proData.serialNumber && isdelivery && (proData.whType !== '3') && !isModelOnly) || isReplace || isBackReason"></div>
            <div class="scanMain" v-if="(!proData.serialNumber && isdelivery && (proData.whType !== '3') && !isModelOnly) || isReplace || isBackReason">
              <label for=""><small>*</small>备注/理由</label>
              <div class="scanDetail">
                <a-form-item
                  style="width: 100%"
                  :validate-status="proReason.validateStatus"
                  :help="proReason.errorMsg"
                >
                  <a-input
                    style="width: 100%"
                    placeholder="请输入备注/理由"
                    v-model="proData.reason"
                    @change="handleReason"
                  />
                </a-form-item>
              </div>
            </div>
          </a-form>
        </div>
        <div class="scanR">
          <div class="scanMain">
            <label for="">产品SN</label>
            <div class="scanDetail">
              <span class="scanCon">{{ proData.serialNumber }}</span>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { getRegistration, findJsList } from '@/api/depot/wareHouse'

function validatePrimeNumber (number) {
  if (number.length > 0) {
    return {
      validateStatus: 'success',
      errorMsg: null
    }
  }
  return {
    validateStatus: 'error',
    errorMsg: '请输入产品批号'
  }
}

function validateWh (whcode) {
  if (whcode !== undefined) {
    return {
      validateStatus: 'success',
      errorMsg: null
    }
  }
  return {
    validateStatus: 'error',
    errorMsg: '请选择库位'
  }
}

function validateReason (reason, proModel) {
  // console.info('proModel---',proModel)
  if (proModel !== 'EMERALDC' && proModel !== '1MTEC30' && proModel !== 'HEALON') {
    if (reason.length > 0) {
      return {
        validateStatus: 'success',
        errorMsg: null
      }
    }
    return {
      validateStatus: 'error',
      errorMsg: '请输入备注/理由'
    }
  }
  return {
    validateStatus: 'success',
    errorMsg: null
  }
}

export default {
  name: 'EditScan',
  props: ['editData'],
  components: {
    moment
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.proData = JSON.parse(JSON.stringify(this.editData.dataList))
    // console.info('this.proData===', this.editData)
    this.whList = this.editData.whList
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
      isReplace: false,
      isBackReason: false
    }
  },
  methods: {
    handleSubmit () {
      // console.info('proData----', this.proData)
      if (this.proData.whType !== '3' &&
          (this.proData.productModel !== 'EMERALDC' && this.proData.productModel !== '1MTEC30' &&
            this.proData.productModel !== 'HEALON') && this.proData.reason === '' && !this.proData.serialNumber) {
        this.proReason = {
          errorMsg: '请输入无码出入库理由',
          validateStatus: 'error'
        }
      } else if (this.proNum.validateStatus === 'error') {
        this.$notification['error']({
          message: '错误',
          description: '产品批号不能为空！',
          duration: 4
        })
      } else if (this.proWhChange.validateStatus === 'error') {
        this.proWhChange.value = '产品库位不能为空'
        this.$notification['error']({
          message: '错误',
          description: '产品库位不能为空！',
          duration: 4
        })
      } else {
        if (this.whList) {
          let newWhName = ''
          this.whList.map(item => {
            if (item.whCode === this.proData.whCode) {
              newWhName = item.whName
            }
          })
          if (this.proData.whType === '3' || this.proData.productModel === 'EMERALDC' || this.proData.productModel === '1MTEC30' || this.proData.productModel === 'HEALON') {
            this.proData.reason = ''
          }
          if (this.proData.whType === '1') {
            this.proData.otherSn = false
          } else {
            this.proData.otherSn = true
          }
          this.proData.whName = newWhName
        }
        this.$emit('ok', this.proData)
      }
    },
    handleCancel () {
      this.$emit('cancel', false)
      this.proData.whCode = this.editData.dataList.whCode
      this.proReason = {
        value: '新增无码出入库理由',
        validateStatus: 'success'
      }
    },
    onChangeStart (e, startTime) {
      this.effectiveDateBegin = e
      this.proData.effectiveDateBegin = startTime
    },
    onChangeEnd (e, endTime) {
      this.effectiveDateEnd = e
      this.proData.effectiveDateEnd = endTime
    },
    handleSelect (val) {
      // console.info(val)
      this.proData.umo = val
    },
    changeNum (val) {
      // console.info('val===', val)
      if (!/^\d+$/.test(val)) {
        this.proData.qty = Number(val.toString().replace(/[^\d]/g, ''))
      } else {
        this.proData.qty = val
      }
    },
    handleNumberChange (e) {
      // console.info('value---',e)
      this.proNum = {
        ...validatePrimeNumber(e.target.value),
        value: e.target.value
      }
      this.proData.batchNumber = e.target.value
    },
    handleReason (e) {
      const proModel = this.proData.productModel
      // console.info('e=====', e.target.value)
      this.proReason = {
        ...validateReason(e.target.value, proModel),
        value: e.target.value
      }
      this.proData.reason = e.target.value
    },
    scodeChange (e) {
      this.proData.registration = e.target.value
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
    handleInput (val) {
      // console.info('val',parseFloat(val.target.value))
      const inputValF = parseFloat(val.target.value)
      if (isNaN(inputValF) || inputValF < 0) {
        this.proData.price = ''
      } else {
        const inputVal = inputValF.toString()
        if (inputVal.indexOf('.')) {
          this.proData.price = parseFloat(inputVal.match(/^\d*(\.?\d{0,2})/g)[0]).toFixed(2)
        }
      }
    },
    handleChangeWh (val) {
      this.whList.map(item => {
        if (item.whCode === val) {
          // console.info('item.whType', item.whCode)
          this.proData.whType = item.whType.toString()
          this.proData.whCode = item.whCode
          this.proData.whName = item.whName
        }
      })
      this.proWhChange = {
        ...validateWh(val),
        value: val
      }
    },
    getFirst () {
      const newList = this.editData
      // console.info('newList====', newList)
      this.proData = JSON.parse(JSON.stringify(newList.dataList))
      // this.proData = newList.dataList
      this.startTime = newList.dataList.effectiveDateBegin ? moment(newList.dataList.effectiveDateBegin) : null
      this.endTime = newList.dataList.effectiveDateEnd ? moment(newList.dataList.effectiveDateEnd) : null
      this.proData.whCode = newList.dataList.whCode
      // console.info('newList====', newList)
      if (newList.dataList.serialNumber) {
        this.isSn = true
      } else {
        this.isSn = false
      }
      if (newList.dataList.productModel === 'EMERALDC' || newList.dataList.productModel === '1MTEC30') {
        this.unitList = ['盒', '个']
      } else {
        this.unitList = ['盒']
      }
      if (newList.dataList.productModel === 'EMERALDC' || newList.dataList.productModel === '1MTEC30' ||
          newList.dataList.productModel === 'HEALON') {
        this.isModelOnly = true
      }
      if (newList.isdelivery === 'delivery') {
        this.isdelivery = true
        this.isAllot = false
      } else if (newList.isdelivery === 'replace') {
        if (newList.dataList.productModel === 'EMERALDC' || newList.dataList.productModel === '1MTEC30' || newList.dataList.productModel === 'HEALON') {
          this.isdelivery = false
          this.isReplace = false
          this.isAllot = false
        } else {
          this.isdelivery = true
          this.isReplace = true
          this.proData.whName = this.editData.whList[0].whName
        }
      } else if (newList.isdelivery === 'proAllot') {
        this.isAllot = true
        this.isdelivery = false
      } else {
        this.isdelivery = false
        this.isAllot = false
      }
      // if (newList.isdelivery === 'replace') {
      //   this.isReplace = true
      //   this.proData.whName = this.editData.whList[0].whName
      //
      //   console.info('this.isBackReason===', this.isBackReason)
      // }
      // console.info('newList.dataList===', newList)
      if (newList.isdelivery === 'estate' && !newList.dataList.serialNumber) {
        if (
          newList.dataList.productModel === 'EMERALDC' || newList.dataList.productModel === '1MTEC30' ||
            newList.dataList.productModel === 'HEALON'
        ) {
          this.isBackReason = false
        } else {
          this.isBackReason = true
        }
      }
      this.whList = newList.whList
      if (newList.dataList.whCode === undefined && newList.dataList.force &&
          (newList.isdelivery === 'delivery' || newList.isdelivery === 'replace' || newList.isdelivery === 'proAllot')) {
        this.proWhChange = {
          value: '产品库位不能为空！',
          validateStatus: 'error'
        }
      }
      this.proNum = {
        value: 1,
        validateStatus: 'success'
      }
      // 获取注册证号列表
      const params = {
        'productModel': this.proData.productModel
      }
      getRegistration(params).then(response => {
        if (response.message === 'SUCCESS') {
          this.scodeList = response.data
        }
      })
      if (newList.isdelivery === 'proAllot') {
        const params = {
          distCode: this.$store.state.user.info.distCode
        }
        findJsList(params).then(res => {
          // console.info(res)
          this.whList = res.data.map(item => {
            return {
              ...item,
              whType: 3
            }
          })
        })
      }
    }
  }
  // watch: {
  //   editData (newList, oldList) {
  //     // console.info('new',newList,'old',oldList)
  //     if (newList.visible) {
  //       this.proData = JSON.parse(JSON.stringify(newList.dataList))
  //       // this.proData = newList.dataList
  //       this.startTime = newList.dataList.effectiveDateBegin ? moment(newList.dataList.effectiveDateBegin) : null
  //       this.endTime = newList.dataList.effectiveDateEnd ? moment(newList.dataList.effectiveDateEnd) : null
  //       this.proData.whCode = newList.dataList.whCode
  //       if (newList.dataList.serialNumber) {
  //         this.isSn = true
  //       } else {
  //         this.isSn = false
  //       }
  //       if (newList.dataList.productModel === 'EMERALDC' || newList.dataList.productModel === '1MTEC30') {
  //         this.unitList = ['盒', '个']
  //       } else {
  //         this.unitList = ['盒']
  //       }
  //       if (newList.dataList.productModel === 'EMERALDC' || newList.dataList.productModel === '1MTEC30' || newList.dataList.productModel === 'HEALON') {
  //         this.isModelOnly = true
  //       }
  //       if (newList.isdelivery === 'delivery') {
  //         this.isdelivery = true
  //         this.isAllot = false
  //       } else if (newList.isdelivery === 'proAllot') {
  //         this.isAllot = true
  //         this.isdelivery = false
  //       } else {
  //         this.isdelivery = false
  //         this.isAllot = false
  //       }
  //       this.whList = newList.whList
  //       this.proNum = {
  //         value: 1,
  //         validateStatus: 'success'
  //       }
  //       // 获取注册证号列表
  //       const params = {
  //         'productModel': this.proData.productModel
  //       }
  //       getRegistration(params).then(response => {
  //         if (response.message === 'SUCCESS') {
  //           this.scodeList = response.data
  //         }
  //       })
  //     }
  //   }
  // }
}
</script>
<style lang="less">
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
          padding: 0 260px 0 0;

          .scanLeft {
            width: 100%;
            padding: 24px 32px;
            box-sizing: border-box;

          }

          .scanR {
            width: 260px;
            position: absolute;
            padding: 28px 24px;
            box-sizing: border-box;
            top: 0;
            right: 0;
            height: 100%;
            display: block;
            background: rgba(251, 251, 251, 1);
            border-left: 1px dotted rgba(226, 227, 227, 1);

            .scanMain .scanDetail {
              span.scanCon {
                line-height: 26px;
                width: 100%;
                height: auto;
              }
            }
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

                &::-webkit-input-placeholder {
                  color: rgba(52, 53, 62, 1) !important;
                }

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
</style>

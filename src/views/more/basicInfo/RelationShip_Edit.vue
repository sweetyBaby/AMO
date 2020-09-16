<template>
  <a-card :bordered="false">
    <a-spin tip="文件保存中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>{{ title }}</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="hancleBack()">
              <a-tooltip placement="top" v-model="isBackShow">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back"/>
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleSave()">
              <a-tooltip placement="top" v-model="isSaveShow">
                <template slot="title">
                  <span>保存产品</span>
                </template>
                <i class="iconfont icon-save"/>
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-form layout="inline" :form="form">
      <div class="basicBorder">
        <a-row :gutter="24">
          <a-col span="8">
            <label for class="basicTitle"><span class="mustFill">*</span>医院名称</label>
            <div class="basicInfo">
              <a-input
                placeholder="请选择医院名称"
                @click="handleSelectCus"
                :style="{ width: '100%', maxWidth: '240px' }"
                v-model="proWrap.hosName"
              />
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle"><span class="mustFill">*</span>医院代码</label>
            <div class="basicInfo">
              <a-input
                placeholder="请选择医院名称"
                :style="{ width: '100%', maxWidth: '240px' }"
                v-model="proWrap.hosCode"
                :disabled="true"
              />
            </div>
          </a-col>
          <a-col span="8">
            <!--            <label for class="basicTitle">备注</label>-->
            <!--            <div class="basicInfo">-->
            <!--              <a-input-->
            <!--                  placeholder="备注"-->
            <!--                  :style="{ maxWidth:'240px',width:'100%' }"-->
            <!--                  v-model="proWrap.remark"-->
            <!--                  :maxLength="100"-->
            <!--              >-->
            <!--              </a-input>-->
            <!--            </div>-->
          </a-col>
          <a-col span="8">
            <label for class="basicTitle"><span class="mustFill">*</span>经销商名称</label>
            <div class="basicInfo">
              <a-select
                showSearch
                :style="{ width: '100%', maxWidth: '240px' }"
                placeholder="选择经销商"
                v-model="proWrap.distCode"
                optionFilterProp="children"
                @change="handleChange"
              >
                <a-select-option
                  v-for="item in distList"
                  :key="item.distCode"
                  :value="item.distCode"
                >
                  {{ item.distName }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle"><span class="mustFill">*</span>经销商代码</label>
            <div class="basicInfo">
              <a-input
                placeholder="请选择经销商"
                :style="{ width: '100%', maxWidth: '240px' }"
                v-model="proWrap.distCode"
                :disabled="true"
              />
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle leftCell">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>经销商所属大区</span>
                </template>
                <span class="mustFill">*</span>经销商所属大区
              </a-tooltip>
            </label>
            <div class="basicInfo">
              <a-input
                placeholder="经销商所属大区"
                :style="{ width: '100%', maxWidth: '240px' }"
                v-model="proWrap.dictName"
                :disabled="true"
              />
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle"><span class="mustFill">*</span>生效日期</label>
            <div class="basicInfo">
              <a-month-picker
                placeholder="选择生效月份"
                :value="isDocData ? proWrap.effectiveDateBegin : null"
                :format="dateFormat"
                @change="handlePicker"
                :disabled-date="disabledDateStart"
                :allowClear="false"
              ></a-month-picker>
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle"><span class="mustFill">*</span>失效日期</label>
            <div class="basicInfo">
              <a-month-picker
                placeholder="选择失效月份"
                :value="isDocDataEnd ? proWrap.effectiveDateEnd : null"
                :format="dateFormat"
                @change="handlePickerEnd"
                :disabled-date="disabledDateEnd"
                :allowClear="false"
              ></a-month-picker>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="scanEmpty" v-if="modelData.length === 0">
        <!--        <h4>请在下方选择一种方式添加产品</h4>-->
        <div class="scanInfo">
          <div class="scanList" @click="handleNewModel">
            <span class="scanIcon"><i class="iconfont icon-plus" /></span>
            <div class="scanMain" >
              <h3>新增型号</h3>
              <p>点击新增型号</p>
            </div>
          </div>
        </div>
      </div>
      <div class="basicBorder newHosSales" v-if="modelData.length > 0">
        <div class="newHosTitle">
          <h3><span>*</span>授权产品型号</h3>
          <div class="basicInfo">
            <div class="selectType">
              <div class="proModel" @click="handleNewModel">
                <span v-if="modelData.length === 0">点击选择产品型号</span>
                <a-tag
                  v-else
                  v-for="(item,index) in modelData.slice(0,3)"
                  :key="index"
                >
                  {{ item.productType }}
                </a-tag>
                <span class="proMore"><i class="iconfont icon-more" /></span>
              </div>
            </div>
          </div>
        </div>
        <a-row :gutter="24" v-for="(product,index) in modelData">
          <a-col span="16">
            <label for class="basicTitle"><span class="mustFill">*</span>型号</label>
            <div class="basicInfo">
              <a-input
                v-model="product.productType"
                placeholder="型号"
                :style="{ width:'240px'}"
                :disabled="true"
              ></a-input>
            </div>
            <label for class="basicTitle"><span class="mustFill">*</span>生效日期</label>
            <div class="basicInfo">
              <a-form-item style="width: 100%" has-feedback>
                <a-month-picker
                  placeholder="选择生效月份"
                  :value="product.effectiveDateBegin"
                  :format="dateFormat"
                  @change="e => handleProPicker(e, product.productType)"
                  :disabled-date="e => disabledProDateStart(e, product.effectiveDateEnd)"
                  :allowClear="false"
                ></a-month-picker>
              </a-form-item>
            </div>
            <label for class="basicTitle"><span class="mustFill">*</span>失效日期</label>
            <div class="basicInfo">
              <a-form-item style="width: 100%" has-feedback>
                <a-month-picker
                  placeholder="选择失效月份"
                  :value="product.effectiveDateEnd"
                  :format="dateFormat"
                  @change=" e => handleProPickerEnd(e, product.productType)"
                  :disabled-date=" e => disabledProDateEnd(e, product.effectiveDateBegin)"
                  :allowClear="false"
                ></a-month-picker>
              </a-form-item>
            </div>
          </a-col>
          <a-col span="8">
            <div class="newProWrap">
              <span class="newPro" @click="handelDel(product.productType)">
                <i class="iconfont icon-empty"></i>
              </span>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <!--     选择医院名称-->
    <select-cus-name
      v-if="selectShow"
      :visible="selectShow"
      :cusData="cusData"
      @selectCus="handleSelectOk"
      @selectCancle="handleSelectCancle"
    ></select-cus-name>
    <pro-model-list
      v-if="isChooseModel"
      :productModel="modelObj"
      @closeMol="handleMClose"
      @ModelSub="handleMolSub"
    ></pro-model-list>
  </a-card>
</template>

<script>
import DhEmpty from '@/views/comPublic/DhEmpty'
import moment from 'moment'
import { STable } from '@/components'
import { DataFilter, exportTable, getParamsFromStore, getStore } from '@/utils/storage'
import { getWareList, userDistRange } from '@/api/depot/wareHouse'
import { relationAdd, relationDetail, relationUpdate } from '@/api/basicInfo/hosData'
import ProModelList from './modules/ProModelList'
import SelectCusName from '@/views/comPublic/modules/SelectCusName'

export default {
  name: 'RelationShipDetail',
  components: {
    DhEmpty,
    STable,
    ProModelList,
    SelectCusName
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.getFirst()
  },
  data () {
    return {
      title: '新增医院授权关系',
      loadingSpin: false,
      isAddShow: false,
      isSaveShow: false,
      isEmpty: false,
      isShowSearch: false,
      isAdd: false,
      editData: {},
      isChooseModel: false,
      modelObj: {},
      degreeList: [],
      proNoList: [],
      selectShow: false,
      cusData: {
        distCode: this.$store.state.user.info.distCode,
        type: 'all'
      },
      queryParam: {
        page: 1,
        size: 10
      },
      distList: [],
      proWrap: {
        effectiveDateBegin: null,
        effectiveDateEnd: null
      },
      isDocData: false,
      isDocDataEnd: false,
      dateFormat: 'YYYY-MM',
      remark: '',
      modelData: [],
      changModel: '',
      isBackShow: false,
      modelList: []
    }
  },
  methods: {
    moment,
    handleChange (e) {
      // console.info('e-----', e)
      this.proWrap.distCode = e
      this.distList.map(item => {
        if (item.distCode === e) {
          this.proWrap.distName = item.distName
          this.proWrap.dictName = item.regionName
        }
      })
    },
    handleEdit (record) {
      const orderInfo = JSON.parse(getParamsFromStore('ORDERINFO'))
      this.isAdd = true
      this.editData = {
        visible: false,
        distCode: orderInfo.distCode,
        distName: orderInfo.distName,
        type: 'edit',
        ...record
      }
    },
    getFirst () {
      const detailData = getStore('RELATIONSHIPADD')
      if (detailData.id) {
        this.title = '编辑医院授权关系'
        this.proWrap.distCode = detailData.distCode
        this.proWrap.distName = detailData.distName
        this.proWrap.hosName = detailData.hosName
        this.proWrap.hosCode = detailData.hosCode
        this.proWrap.effectiveDateBegin = moment(detailData.effectiveDateBegin, 'YYYY-MM')
        this.proWrap.effectiveDateEnd = moment(detailData.effectiveDateEnd, 'YYYY-MM')
        this.proWrap.remark = detailData.remark
        this.proWrap.dictName = detailData.dictName
        this.isDocData = true
        this.isDocDataEnd = true
        const params = {
          id: detailData.id
        }
        relationDetail(params).then(res => {
          // console.info('res----', res.data)
          this.modelData = res.data
        })
      }
      userDistRange().then(res => {
        if (res.message === 'SUCCESS') {
          this.distList = res.data
        }
      })
    },
    handelDel (productType) {
      // console.info('product====', product, this.proList)
      const newProList = []
      this.modelData.map(item => {
        if (item.productType !== productType) {
          newProList.push(item)
        }
      })
      this.modelData = newProList
    },
    handleSelectCus () {
      // console.info('3333')
      this.selectShow = true
      this.cusData = {
        ...this.cusData,
        cusName: this.proWrap.hosName,
        cusCode: this.proWrap.hosCode
      }
    },
    // 选择客户名称弹框
    handleSelectOk (subVal) {
      this.proWrap.hosName = subVal.cusName
      this.proWrap.hosCode = subVal.cusCode
      this.selectShow = false
    },
    handleSelectCancle () {
      this.selectShow = false
    },
    handleNewModel () {
      // console.info('this.proWrap====', this.proWrap)
      if (!this.isEmptyData(this.proWrap.distCode) && !this.isEmptyData(this.proWrap.hosCode) && !this.isEmptyData(this.proWrap.effectiveDateBegin) && !this.isEmptyData(this.proWrap.effectiveDateEnd)) {
        const checkData = []
        this.modelData.map(item => {
          if (item.productType && (item.productType !== undefined)) {
            checkData.push(item.productType)
          }
        })
        this.isChooseModel = true
        this.modelObj = {
          checkList: checkData,
          model: this.typeList,
          visible: true,
          type: 'model'
        }
      } else {
        this.$notification['error']({
          message: '提示',
          description: '基础数据必填项不能为空！',
          duration: 2
        })
      }
    },
    isEmptyData (str) {
      // 验证是否为空
      if (str === null || str === undefined || str === '') {
        return true
      }
      return false
    },
    handleSave () {
      const _that = this
      if (!this.loadingSpin && this.modelData.length > 0) {
        let isValid = 0
        let isListEmpty = 0
        this.modelData.map(item => {
          if (this.isEmptyData(item.effectiveDateBegin) || this.isEmptyData(item.effectiveDateEnd)) {
            isValid += 1
          } else if (moment(item.effectiveDateBegin).isBefore(this.proWrap.effectiveDateBegin) || moment(item.effectiveDateEnd).isAfter(this.proWrap.effectiveDateEnd) || moment(item.effectiveDateBegin).isAfter(this.proWrap.effectiveDateEnd) || moment(item.effectiveDateEnd).isBefore(this.proWrap.effectiveDateBegin)) {
            isListEmpty += 1
          } else {
            item.effectiveDateBegin = moment(item.effectiveDateBegin).format('YYYY-MM-DD')
            item.effectiveDateEnd = moment(item.effectiveDateEnd).format('YYYY-MM-DD')
          }
        })
        // console.info('isListEmpty====', isListEmpty)
        if (isValid === 0 && isListEmpty === 0) {
          const detailData = getStore('RELATIONSHIPADD')
          const params = {
            ...this.proWrap,
            effectiveDateBegin: moment(this.proWrap.effectiveDateBegin).format('YYYY-MM-DD'),
            effectiveDateEnd: moment(this.proWrap.effectiveDateEnd).format('YYYY-MM-DD'),
            detail: this.modelData
          }
          // console.info('params===', params)
          if (detailData.id) {
            params.id = detailData.id
            relationUpdate(params).then(res => {
              if (res.message === 'SUCCESS') {
                this.$notification['success']({
                  message: '提示',
                  description: '编辑成功！',
                  duration: 2
                })
                this.loadingSpin = false
                // console.info('res====', res)
                _that.hancleBack()
              } else {
                this.$notification['error']({
                  message: '提示',
                  description: res.message || '编辑失败！',
                  duration: 2
                })
              }
            })
          } else {
            relationAdd(params).then(res => {
              if (res.message === 'SUCCESS') {
                this.$notification['success']({
                  message: '提示',
                  description: '新增成功！',
                  duration: 2
                })
                this.loadingSpin = false
                // console.info('res====', res)
                _that.hancleBack()
              } else {
                this.$notification['error']({
                  message: '提示',
                  description: res.message || '新增失败！',
                  duration: 2
                })
              }
            })
          }
        } else if (isListEmpty !== 0) {
          this.$notification['error']({
            message: '提示',
            description: '产品型号生效日期，失效日期范围不对！',
            duration: 2
          })
        } else if (isValid !== 0) {
          this.$notification['error']({
            message: '提示',
            description: '必填项不可为空！',
            duration: 2
          })
        }
      } else {
        this.$notification['error']({
          message: '提示',
          description: '必填项不可为空！',
          duration: 2
        })
      }
    },
    handleModelCancle () {
      this.isAdd = false
      this.editData = {
        visible: false
      }
    },
    hancleBack () {
      this.$router.push({
        name: 'RelationShip'
      })
      this.isBackShow = false
      this.modelData = []
      this.proWrap = {
        effectiveDateBegin: null,
        effectiveDateEnd: null,
        distCode: undefined,
        hosCode: null,
        dictName: '',
        remark: ''
      }
      this.title = '新增医院授权关系'
    },
    handleSearch () {
      this.isShowSearch = true
    },
    onSearchClose () {
      this.isShowSearch = false
    },
    handleSearchR () {
      this.isShowSearch = false
      this.$refs.table.refresh(true)
    },
    handlePicker (date, dateString) {
      // console.info('date===', date)
      this.isDocData = true
      this.proWrap.effectiveDateBegin = date
      if (this.modelData.length > 0) {
        this.modelData.map(item => {
          item.effectiveDateBegin = date
        })
      }
    },
    handlePickerEnd (date) {
      this.isDocDataEnd = true
      this.proWrap.effectiveDateEnd = date
      if (this.modelData.length > 0) {
        this.modelData.map(item => {
          item.effectiveDateEnd = date
        })
      }
    },
    handleProPicker (date, proMod) {
      this.modelData.map(item => {
        if (item.productType === proMod) {
          item.effectiveDateBegin = date
        }
      })
    },
    handleProPickerEnd (date, proMod) {
      this.modelData.map(item => {
        if (item.productType === proMod) {
          item.effectiveDateEnd = date
        }
      })
    },
    disabledDateStart (startValue) {
      const endValue = this.proWrap.effectiveDateEnd
      // console.info('endValue---', endValue)
      return endValue ? startValue.valueOf() > endValue.valueOf('') : null
    },
    disabledProDateStart (startDate, endDate) {
      const endValue = this.proWrap.effectiveDateEnd
      const startVal = this.proWrap.effectiveDateBegin
      return startDate.valueOf() > endValue.valueOf('') || startDate.valueOf() < startVal.valueOf('') || startDate.valueOf() > endDate.valueOf()
    },
    disabledDateEnd (endValue) {
      const startValue = this.proWrap.effectiveDateBegin
      return startValue ? startValue.valueOf() > endValue.valueOf() : null
    },
    disabledProDateEnd (endDate, startDate) {
      const startValue = this.proWrap.effectiveDateBegin
      const endValue = this.proWrap.effectiveDateEnd
      return startValue.valueOf() > endDate.valueOf() || endDate.valueOf() > endValue.valueOf() || endDate.valueOf() < startDate.valueOf()
    },
    handleMClose () {
      this.isChooseModel = false
    },
    handleMolSub (checkList) {
      // console.info('checkList====', checkList)
      const selectList = JSON.parse(JSON.stringify(checkList))
      const checkData = selectList
      this.modelList = selectList
      this.isChooseModel = false
      // console.info('this.selectList====', selectList, this.modelData, this.changModel)
      const newList = []
      const checkLists = []
      checkData.map(item => {
        let checkIndex = -1
        checkIndex = this.modelData.findIndex(obj => obj.productType === item)
        if (checkIndex === -1) {
          newList.push({
            productType: item,
            effectiveDateBegin: this.proWrap.effectiveDateBegin,
            effectiveDateEnd: this.proWrap.effectiveDateEnd
          })
        } else {
          newList.push(this.modelData[checkIndex])
        }
      })
      // console.info('newList[[[[', newList)
      this.modelData = newList
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'RelationShip_Edit') {
        this.getFirst()
      }
    }
  }
}
</script>

<style scoped lang="less">
  .typeName {
    padding: 0 0 16px 0;
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

  .tableBtn {
    :global {
      .ant-popover-content {
        padding: 0;
        min-width: 160px;

        a {
          width: 100%;
          padding: 0 0 0 32px;
          color: rgba(147, 147, 147, 1);
          display: inline-block;
          box-sizing: border-box;
          height: 38px;
          line-height: 38px;

          .iconfont {
            font-size: 19px;
            color: rgba(147, 147, 147, 1);
            padding: 0 12px 0 0;
          }

          &:hover {
            background: rgba(246, 246, 248, 1);
            color: rgba(21, 58, 175, 1);

            .iconfont {
              color: rgba(21, 58, 175, 1);
            }
          }
        }
      }
    }
  }

  .orderInfo {
    padding: 24px 0 0 0;
  }

  //上传中
  .uploading {
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.65);
    z-index: 99;
    left: 0;
    top: 0;

    .ant-spin-text {
      color: #fff;
      position: relative;
      top: 250px;
    }

    .ant-spin-dot {
      top: 250px;

      i {
        background-color: #fff;
      }
    }
  }

  /*详情基本信息 */
  .basicBorder {
    border: 1px solid rgba(233, 233, 233, 1);
    overflow: hidden;
    background: rgba(251, 251, 251, 1);

    > .ant-row {
      margin-top: -4px;

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
          &.leftCell{
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          span.mustFill {
            color: rgba(225, 120, 119, 1);
            padding: 0 8px 0 0;
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

    .ant-input-affix-wrapper {
      border: none;
    }

    .ant-input,
    .ant-select-selection {
      background: white;
      border: 1px solid rgba(233, 233, 233, 1);
      border-radius: 4px;
    }

    &.newHosSales {
      .newHosTitle {
        width: 100%;
        display: inline-block;
        border-bottom: 1px solid rgba(233, 233, 233, 1);

        h3 {
          color: rgba(156, 156, 158, 1);
          font-size: 14px;
          font-weight: bold;
          padding: 16px 40px;
          margin: 0;
          float: left;

          span {
            color: rgba(225, 120, 119, 1);
            padding: 0 8px 0 0;
          }
        }
        .basicInfo{
          float: right;
          margin: 12px 12px 8px 0;
          display: inline-block;
        }
        .newPro {
          float: right;
          border: none;
          background: none !important;
          padding: 0 40px;
          line-height: 54px;
          border-left: 1px solid rgba(233, 233, 233, 1);
          display: inline-block;

          .iconfont {
            font-size: 20px;
            color: rgba(207, 207, 207, 1);
            cursor: pointer;
          }

          &:hover {
            .iconfont {
              color: rgba(62, 77, 168, 1);
            }
          }
        }
        .selectType{
          background: #fff;
          border: 1px solid rgba(233, 233, 233, 1);
          display: block;
          padding: 8px;
          border-radius: 4px;
        }
      }

      > .ant-row > div {
        .basicInfo {
          border: none;
        }

        .newProWrap {
          width: 100%;
          display: inline-block;
          margin-right: -12px;
          margin-left: -12px;

          .newPro {
            float: right;
            border: none;
            background: none !important;
            padding: 0 40px;
            line-height: 54px;
            border-left: 1px solid rgba(233, 233, 233, 1);
            display: inline-block;

            .iconfont {
              font-size: 20px;
              color: rgba(207, 207, 207, 1);
              cursor: pointer;
            }

            &:hover {
              .iconfont {
                color: rgba(62, 77, 168, 1);
              }
            }
          }
        }
      }
    }
  }

  .newHosSales {
    margin: 24px 0;
  }
  .scanEmpty{
    width: 100%;
    text-align: center;
    padding: 70px 160px;

    h4{
      color: rgba(147, 147, 147, 1);
      font-size: 14px;
      padding: 0 0 40px 0;
    }
    .scanInfo{
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-around;
      .scanBor{
        width: 1px;
        height: 100%;
        min-height: 80px;
        display: inline-block;
        background: rgba(236, 236, 236, 1);
      }
      .scanList{
        position: relative;
        padding: 12px 40px 12px 94px;
        .scanIcon{
          position: absolute;
          left: 18px;
          top: 12px;
          width: 50px;
          height: 50px;
          border-radius:25px;
          background: white;
          border: 2px solid rgba(62, 77, 168, 1);
          line-height: 46px;
          .iconfont{
            color: rgba(251, 199, 115, 1);
            font-size: 30px;
          }
        }
        &:hover{
          background: rgba(251, 251, 251, 1);
        }
        .scanMain{
          text-align: left;
          width: 100%;
          h3{
            font-size: 18px;
            color: rgba(62, 77, 168, 1);
          }
          p{
            color: rgba(147, 147, 147, 1);
            font-size: 14px;
            margin: 0 ;
          }
        }
      }
    }

  }
</style>

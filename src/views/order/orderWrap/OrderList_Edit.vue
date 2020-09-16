<template>
  <a-card :bordered="false">
    <a-spin tip="文件保存中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>新增订单产品</h3>
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
            <span class="titleBtn" @click="handleNewModel">
              <a-tooltip placement="top" v-model="isAddShow">
                <template slot="title">
                  <span>新增产品</span>
                </template>
                <i class="iconfont icon-plus"/>
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
            <label for class="basicTitle"><span>*</span>经销商名称</label>
            <div class="basicInfo">
              <a-select
                showSearch
                style="width: 100%;"
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
            <label for class="basicTitle">备注</label>
            <div class="basicInfo">
              <a-input
                placeholder="备注"
                :style="{ maxWidth:'240px',width:'100%' }"
                v-model="proWrap.remark"
                :maxLength="100"
              >
              </a-input>
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
      <div class="basicBorder newHosSales" v-for="model in modelData" v-if="modelData.length > 0">
        <div class="newHosTitle">
          <h3><span>*</span>添加度数及数量</h3>
          <span class="newPro" @click="handleAdd(model.productModel, model.proList)">
            <a-tooltip placement="top">
              <template slot="title">
                <span>度数选择</span>
              </template>
              <i class="iconfont icon-plus"></i>
            </a-tooltip>
          </span>
          <div class="basicInfo">
            <a-input v-model="model.productModel" :disabled="true"></a-input>
          </div>
        </div>
        <a-row :gutter="24" v-for="(product,index) in model.proList">
          <a-col span="16">
            <label for class="basicTitle"><span>*</span>度数</label>
            <div class="basicInfo">
              <a-input
                v-model="product.degree"
                placeholder="请输入度数"
                :style="{ width:'240px'}"
                :disabled="true"
              ></a-input>
            </div>
            <label for class="basicTitle"><span>*</span>数量</label>
            <div class="basicInfo">
              <a-form-item style="width: 100%" has-feedback>
                <a-input-number
                  v-model="product.qty"
                  placeholder="数量"
                  :min="1"
                  :max="999999999999999"
                  @change="handleInput(product, model.productModel)"
                  :style="{ width:'240px'}"
                ></a-input-number>
              </a-form-item>
            </div>
          </a-col>
          <a-col span="8">
            <div class="newProWrap">
              <span class="newPro" @click="handelDel(product, model.productModel)">
                <i class="iconfont icon-empty"></i>
              </span>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <a-drawer
      title="新增产品"
      placement="right"
      @close="handleModelCancle"
      :visible="isAdd"
      wrapClassName="searchWrap"
      width="480"
    >
      <add-new-order
        v-if="isAdd"
        :editData="editData"
        @cancel="handleModelCancle"
        @submit="handleModleSub"
      >
      </add-new-order>
    </a-drawer>
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
import { DataFilter, exportTable, getParamsFromStore } from '@/utils/storage'
import { getWareList, userDistRange } from '@/api/depot/wareHouse'
import { getOrderInfo, saveOrder, getCrgdPro } from '@/api/depot/order'
import AddNewOrder from './modules/AddNewOrder'
import ProModelList from './modules/ProModelList'

export default {
  name: 'OrderList',
  components: {
    DhEmpty,
    STable,
    AddNewOrder,
    ProModelList
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.getFirst()
  },
  data () {
    return {
      title: '新增订单',
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
      queryParam: {
        page: 1,
        size: 10
      },
      distList: [],
      proList: [{
        productId: 'producnt01',
        productType: undefined,
        quota: ''
      }],
      proWrap: {},
      isDocData: null,
      dateFormat: 'YYYY-MM-DD HH:mm',
      type: '01',
      typeList: [
        {
          typeCode: '01',
          typeName: '全部'
        }, {
          typeCode: '02',
          typeName: '未发货'
        }, {
          typeCode: '03',
          typeName: '部分发货'
        }, {
          typeCode: '04',
          typeName: '已发货'
        }, {
          typeCode: '05',
          typeName: '已确认'
        }, {
          typeCode: '06',
          typeName: '已取消'
        }],
      remark: '',
      modelData: [],
      changModel: '',
      isBackShow: false
    }
  },
  methods: {
    handleChange (e) {
      // console.info('e-----', e)
      this.proWrap.distCode = e
      this.distList.map(item => {
        if (item.distCode === e) {
          this.proWrap.distName = item.distName
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
      userDistRange().then(res => {
        this.distList = res.data
        if (res.message === 'SUCCESS') {
          this.getProModel()
        }
      })
    },
    getProModel () {
      getCrgdPro().then(res => {
        console.info('modelData-====', res.data)
        if (res.message === 'SUCCESS') {
          const modelData = []
          res.data.map(item => {
            if (modelData.findIndex(list => list.productModel === item.productModel) === -1) {
              modelData.push(item)
            }
          })
          console.info('modelData====', modelData)
          this.proNoList = res.data
          this.typeList = modelData
          if (this.editData.rowkey) {
            this.handleSelect(this.editData.productModel)
          }
        }
      })
    },
    // 删除产品型号
    handelDel (product, productModel) {
      // console.info('product====', product, this.proList)
      this.modelData.map(item => {
        if (item.productModel === productModel) {
          item.proList = item.proList.filter(obj => obj.degree !== product.degree)
        }
      })
    },
    // 数量控制
    handleInput (e) {
      // console.info('e----', e)
      if (e.qty) {
        const number = e.qty.toString()
        const reg = /[^0-9]/g
        if (reg.test(number) && number !== 0) {
          e.qty = number.replace(/[^0-9]/g, '')
        }
      }
    },
    handleNewModel () {
      if (this.proWrap.distCode && (this.proWrap.distCode !== undefined)) {
        const checkData = []
        this.modelData.map(item => {
          if (item.productModel && (item.productModel !== undefined)) {
            checkData.push(item.productModel)
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
          description: '请选择经销商',
          duration: 2
        })
      }
    },
    handleAdd (model, proList) {
      this.handleSelect(model)
      this.isChooseModel = true
      const checkData = []
      // console.info('this.proList===',proList, this.proNoList)
      proList.map(item => {
        if (item.degree && item.degree !== undefined) {
          checkData.push(item.degree)
        }
      })
      this.changModel = model
      this.modelObj = {
        checkList: checkData,
        degreeList: this.degreeList,
        visible: true,
        type: 'degree'
      }
    },
    handleSave () {
      // console.info('this.modelData', this.modelData)
      const _that = this
      if (!this.loadingSpin && this.modelData.length > 0) {
        // this.loadingSpin = true
        let isValid = 0
        let isListEmpty = 0
        const orderInfo = JSON.parse(getParamsFromStore('ORDERINFO'))
        const checkDetails = []
        // console.info('this.modelData====', this.modelData)
        this.modelData.map(item => {
          let proModelObj = {}
          this.typeList.map(type => {
            if (type.productModel === item.productModel) {
              proModelObj = type
            }
          })
          if (item.proList.length === 0) {
            isListEmpty += 1
          }
          // isListEmpty =  > 0 ? true : false
          item.proList.map(obj => {
            const proObj = {
              degree: obj.degree,
              qty: obj.qty,
              crgdProductId: obj.crgdProductId
            }
            delete proModelObj.id
            // console.info('proModelObj----', proModelObj)
            if (obj.qty && obj.qty !== undefined) {
              checkDetails.push({
                ...proModelObj,
                ...proObj
              })
            } else {
              isValid += 1
            }
          })
        })
        // console.info('isValid====', isValid)
        if (isValid === 0 && isListEmpty === 0) {
          const params = {
            distCode: this.proWrap.distCode,
            distName: this.proWrap.distName,
            remark: this.proWrap.remark,
            orderDetails: checkDetails
          }
          // console.info('params===', params)
          saveOrder(params).then(res => {
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
        } else if (isListEmpty !== 0) {
          this.$notification['error']({
            message: '提示',
            description: '度数及数量不能为空！',
            duration: 2
          })
        } else if (isValid !== 0) {
          this.$notification['error']({
            message: '提示',
            description: '必填项不可为空！',
            duration: 2
          })
        }
      } else if (this.modelData.length === 0) {
        this.$notification['error']({
          message: '提示',
          description: '还未添加任何型号哦~',
          duration: 2
        })
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
    handleModleSub (formdata) {
      const newData = []
      let modify = 0
      let oldData = JSON.parse(JSON.stringify(this.data))
      let checkIndex = -1
      // console.info('formdata===', formdata)
      oldData.map((old, index) => {
        if (old.productModel === formdata.orderDetails[0].productModel && old.degree ===
            formdata.orderDetails[0].degree) {
          if (formdata.orderDetails[0].rowkey && old.rowkey === formdata.orderDetails[0].rowkey) {
            old.qty = formdata.orderDetails[0].qty
          } else if (formdata.orderDetails[0].rowkey && old.rowkey !== formdata.orderDetails[0].rowkey) {
            old.qty = old.qty + formdata.orderDetails[0].qty
            checkIndex = formdata.orderDetails[0].rowkey
          } else {
            old.qty = old.qty + formdata.orderDetails[0].qty
          }
          modify = 1
        }
      })
      // console.info('checkIndex===', checkIndex)
      if (checkIndex !== 0) {
        oldData = oldData.filter(obj => obj.rowkey !== checkIndex)
      }
      if (modify < 1) {
        if (!formdata.orderDetails[0].rowkey) {
          const newInfo = {
            rowkey: formdata.orderDetails[0].productModel + '_' + formdata.orderDetails[0].degree,
            ...formdata.orderDetails[0]
          }
          this.data.push(newInfo)
        } else {
          this.data.map(old => {
            if (old.rowkey === formdata.orderDetails[0].rowkey) {
              newData.push(formdata.orderDetails[0])
            } else {
              newData.push(old)
            }
          })
          this.data = newData
        }
      } else {
        this.data = oldData
      }
      // console.info('this.data====', this.data)
      this.remark = formdata.orderDetails[0].remark
      this.isAdd = false
      this.editData = {
        visible: false
      }
    },
    hancleBack () {
      this.$router.push({
        name: 'OrderList'
      })
      this.isBackShow = false
      this.queryParam.orderNo = ''
      this.modelData = []
      this.proWrap = {
        distCode: undefined,
        remark: ''
      }
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
    handleReset () {
      this.isDocData = false
      this.queryParam = {
        ...this.queryParam,
        docNo: '',
        cusName: '',
        docDateStart: null,
        docDateEnd: null,
        distCode: undefined
      }
    },
    handlePicker (date, dateString) {
      // console.info(date)
      this.queryParam.docData = date
      this.isDocData = true
      this.queryParam.docDateStart = moment(date[0]).format('YYYY-MM-DD')
      this.queryParam.docDateEnd = moment(date[1]).format('YYYY-MM-DD')
    },
    handleSizeChange (val) {

    },
    handleSelect (val) {
      // console.info('this.typeList----', this.typeList)
      this.degreeList = []
      this.proNoList.map(item => {
        if (item.productModel === val) {
          const degreeId = this.degreeList.findIndex(obj => obj.degree === item.degree)
          if (degreeId < 0) {
            this.degreeList.push(item)
          }
          this.productModel = item.productModel
          this.productName = item.productName
        }
      })
      this.changModel = val
      // console.info(' this.degreeList.====',  this.degreeList)
      this.degreeList.sort((x, y) => parseFloat(x.degree) - parseFloat(y.degree))
    },
    handleMClose () {
      this.isChooseModel = false
    },
    handleMolSub (checkList) {
      const selectList = JSON.parse(checkList)
      const checkData = selectList.list
      this.isChooseModel = false
      // console.info('this.checkList====', selectList)
      const newList = []
      let checkLists = []
      checkData.map(item => {
        let checkIndex = -1
        if (selectList.type === 'model') {
          checkIndex = this.modelData.findIndex(obj => obj.productModel === item)
          if (checkIndex === -1) {
            newList.push({
              productModel: item,
              proList: []
            })
          } else {
            newList.push(this.modelData[checkIndex])
          }
        } else {
          // checkIndex = this.proList.findIndex(obj => obj.degree === item)
          this.modelData.map(model => {
            if (model.productModel === this.changModel) {
              checkLists = model
            }
          })
          // console.info('checkLists=====', checkLists, this.proNoList)
          this.proNoList.map((obj, index) => {
            if (obj.degree === item && obj.productModel === this.changModel) {
              checkIndex = index
            }
          })
          // console.info('checkIndex=====', checkIndex)
          if (checkIndex < 0) {
            newList.push({
              productId: Date.parse(new Date()),
              degree: item,
              crgdProductId: this.proNoList[checkIndex].crgdProductId,
              qty: ''
            })
          } else {
            newList.push(this.proNoList[checkIndex])
          }
        }
      })
      let degreeData = []
      if (selectList.type === 'model') {
        degreeData = newList
      } else {
        this.modelData.map(item => {
          if (item.productModel === this.changModel) {
            degreeData.push({
              ...item,
              proList: newList
            })
          } else {
            degreeData.push(item)
          }
        })
      }
      // console.info('degreeData[[[[', degreeData)
      this.modelData = degreeData
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'OrderList_Edit') {
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

          span {
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

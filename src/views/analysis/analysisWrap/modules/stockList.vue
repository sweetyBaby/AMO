<template>
  <a-modal
    title="选择库位和产品型号"
    :width="950"
    :visible="productModel.visible"
    @ok="handleSubmit"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <div>
      <a-spin :spinning="confirmLoading" class="modal-info">
        <template>
          <div class="proModelWrap">
            <h3>选择库位
                <small>最多可选10个库位，显示最佳</small>
                <a-tooltip placement="top" >
                  <template slot="title">
                    <span>清空</span>
                  </template>
                  <a @click="handleEmptyStock" class="proEmpty"><i class="iconfont icon-allRead" /></a>
                </a-tooltip>
            </h3>
            <div class="stockType">
              <div class="detailsTitle">
                <span>统计全量</span>
              </div>
              <div class="stockTitle" v-for="(item,index) in stockType" :key="index">
                <a-checkbox @change="(e)=>{onChangeTitle(e,item.name,index)}" :disabled="item.disabled" :value="item.whCode" :checked="item.checked">{{ item.name }}-统计全量</a-checkbox>
              </div>
              <div style="clear: both"></div>
              <div class="detailsTitle">
                <span>分库位统计</span>
                <i class="iconfont icon-arrow-down" v-show="!detailsShow" @click="detailsTurn">展开全部</i>
                <i class="iconfont icon-arrow-up" v-show="detailsShow" @click="detailsTurn">收起</i>
              </div>
              <div v-show="detailsShow">
                <div class="stockDetails" v-if="stockDetails.type1.length > 0">
                  <h4>自有库</h4>
                  <a-checkbox
                    v-for="(item,index) in stockDetails.type1"
                    :key="index"
                    @change="(e)=>{onChange(e,1,item.whName,index)}"
                    :value="item.whCode"
                    :title="item.whName"
                    :disabled="item.disabled"
                    :checked="item.checked"
                  >{{ item.whName }}</a-checkbox>
                </div>
                <div class="stockDetails" v-if="stockDetails.type3.length > 0">
                  <h4>自有寄售库</h4>
                  <a-checkbox
                    v-for="(item,key) in stockDetails.type3"
                    @change="(e)=>{onChange(e,3,item.whName,key)}"
                    :key="key"
                    :value="item.whCode"
                    :title="item.whName"
                    :disabled="item.disabled"
                    :checked="item.checked"
                  >{{ item.whName }}</a-checkbox>
                </div>
                <div class="stockDetails" v-if="stockDetails.type2.length > 0">
                  <h4>华润寄售库</h4>
                  <a-checkbox
                    v-for="(item,key) in stockDetails.type2"
                    @change="(e)=>{onChange(e,2,item.whName,key)}"
                    :key="key"
                    :value="item.whCode"
                    :title="item.whName"
                    :disabled="item.disabled"
                    :checked="item.checked">{{ item.whName }}</a-checkbox>
                </div>
                <div class="stockDetails" v-if="stockDetails.type4.length > 0">
                  <h4>污损库</h4>
                  <a-checkbox
                    v-for="(item,key) in stockDetails.type4"
                    @change="(e)=>{onChange(e,4,item.whName,key)}"
                    :key="key"
                    :value="item.whCode"
                    :title="item.whName"
                    :disabled="item.disabled"
                    :checked="item.checked">{{ item.whName }}</a-checkbox>
                </div>
                <!--<div class="stockDetails">
                  <h4>报废库</h4>
                  <a-checkbox v-for="(item,key) in stockDetails.type5" @change="(e)=>{onChange(e,5,item.whName,key)}" :key="key" :value="item.whCode" :title="item.whName" :disabled="item.disabled" :checked="item.checked">{{item.whName}}</a-checkbox>
                </div>-->
                <div style="clear: both"></div>
              </div>
            </div>
          </div>
        </template>
      </a-spin>
    </div>
    <div>
      <a-spin :spinning="confirmLoading" class="modal-info" style="margin-top: 10px">
        <template>
          <div class="proModelWrapSummary">
            <h3>选择型号
                <small v-show="!productAllStatus">最多可选6个型号，显示最佳</small>
                <a-tooltip placement="top" >
                  <template slot="title">
                    <span>清空</span>
                  </template>
                  <a @click="handleEmpty" class="proEmpty"><i class="iconfont icon-allRead" /></a>
                </a-tooltip>
                <a-tooltip placement="top" v-show="productAllStatus">
                  <template slot="title">
                    <span>全选</span>
                  </template>
                  <a @click="handleAll" class="proEmpty"><i class="iconfont icon-checkAll" /></a>
                </a-tooltip>
            </h3>
            <a-checkbox-group :options="modelList" v-model="checkedList.productList" @change="onChangeProduct" >
              <span slot="label" slot-scope="{value}">{{ value }}</span>
            </a-checkbox-group>
          </div>
        </template>
      </a-spin>
    </div>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { retriveNameData, findProductMo } from '@/api/basicInfo/hosData'
import { DataFilter } from '@/utils/storage'

import { retriveLocation } from '@/api/information'
export default {
  props: ['productModel'],
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      checkedList: {
        checkTypeListName: [],
        checkTypeList: [],
        checkListName: [],
        checkList: {
          1: {
            checkList: [],
            checkListName: []
          },
          2: {
            checkList: [],
            checkListName: []
          },
          3: {
            checkList: [],
            checkListName: []
          },
          4: {
            checkList: [],
            checkListName: []
          },
          5: {
            checkList: [],
            checkListName: []
          },
        },
        productList: [],
      },
      detailsShow: false,
      modelList: [],
      productAllStatus: true,
      indeterminate: true,
      checkAll: false,
      stockType: [{
        whCode: 1,
        name: '自有库',
        checked: false
      }, {
        whCode: 3,
        name: '自有寄售库',
        checked: false
      }, {
        whCode: 2,
        name: '华润寄售库',
        checked: false
      }, {
        whCode: 4,
        name: '污损库',
        checked: false
      }],
      stockDetails: {
        type1: [],
        type2: [],
        type3: [],
        type4: [],
        type5: [],
      }
    }
  },
  mounted() {
    this.changeCheck()
    this.getProModel()
  },
  methods: {
    detailsTurn() { // 展开收起
      this.detailsShow = !this.detailsShow
    },
    stockTypeStatus(data, current) { // 改变类型
      for (let i = 0; i < data.length; i++) {
        if (current.checked) {
          data[i].disabled = false
        } else {
          data[i].disabled = true
        }
      }
    },
    getProModel() { // 获取产品型号
      const params = {
        'productModel': '',
        'distCode': this.productModel.distCode
      }
      findProductMo(params).then(res => {
        const proMol = res.data.map(item => item.productModel)
        if (this.checkedList.productList.length > 5 && !this.productAllStatus) {
          this.modelList = proMol.map(item => {
            if (this.checkedList.productList.indexOf(item) !== -1) {
              return {
                label: item,
                value: item,
                disabled: false
              }
            }
            return {
              label: item,
              value: item,
              disabled: true
            }
          })
        } else {
          this.modelList = proMol.map(item => {
            return {
              label: item,
              value: item,
              disabled: false
            }
          })
        }
      })
    },
    onChangeProduct(checkedList) { // 产品型号选择
      this.indeterminate = !!checkedList.length && (checkedList.length < this.modelList.length)
      this.checkAll = checkedList.length === this.modelList.length
      if (this.productAllStatus) {
        this.modelList.map(item => {
          item.disabled = false
        })
      } else if (checkedList.length >= 6) {
        this.modelList.map(item => {
          if (checkedList.indexOf(item.value) !== -1) {
            item.disabled = false
          } else {
            item.disabled = true
          }
        })
      } else {
        this.modelList.map(item => {
          item.disabled = false
        })
      }
    },
    onChangeTitle(e, name, key) { // 选择库位类型
      const current = e.target
      this.stockType[key].checked = current.checked
      const index = this.checkedList.checkTypeList.indexOf(current.value)
      if (current.checked) {
        if (index === -1) {
          this.checkedList.checkTypeList.push(current.value)
          this.checkedList.checkTypeListName.push(name)
        }
      } else if (index !== -1) {
        this.checkedList.checkTypeList.splice(index, 1)
        this.checkedList.checkTypeListName.splice(index, 1)
      }
      if (this.checkedList.checkTypeList.length > 0) {
        this.productAllStatus = true
        this.changeDisabled(this.stockDetails.type1)
        this.changeDisabled(this.stockDetails.type2)
        this.changeDisabled(this.stockDetails.type3)
        this.changeDisabled(this.stockDetails.type4)
        this.changeDisabled(this.stockDetails.type5)
      } else {
        this.changeDisabledFalse(this.stockDetails.type1)
        this.changeDisabledFalse(this.stockDetails.type2)
        this.changeDisabledFalse(this.stockDetails.type3)
        this.changeDisabledFalse(this.stockDetails.type4)
        this.changeDisabledFalse(this.stockDetails.type5)
      }
    },
    changeCheck() { // 初始化获取数据
      this.checkedList.checkList = this.productModel.checkList
      this.checkedList.productList = this.productModel.checkProductList
      this.checkedList.checkTypeList = this.productModel.checkTypeList
      this.checkedList.checkTypeListName = this.productModel.checkTypeListName
      this.checkedList.checkListName = this.productModel.checkListName
      this.checkStatus(this.stockType, this.checkedList.checkTypeList)
      const length = this.checkedList.checkList[1].checkList.length + this.checkedList.checkList[2].checkList.length + this.checkedList.checkList[3].checkList.length + this.checkedList.checkList[4].checkList.length + this.checkedList.checkList[5].checkList.length
      if (this.checkedList.checkTypeList.length > 0 || length < 1) {
        this.changeDisabledFalse(this.stockType)
        this.productAllStatus = true
      } else {
        this.changeDisabled(this.stockType)
        this.productAllStatus = false
      }
      this.getStockDetailsData()
    },
    checkDisabled(data, checkList) { // 改变状态
      for (let i = 0; i < data.length; i++) {
        if (checkList.indexOf(data[i].whCode) != -1) {
          data[i].disabled = false
        } else {
          data[i].disabled = true
        }
      }
      this.$forceUpdate()
    },
    checkStatus(data, parentList) { // checked状态
      for (let i = 0; i < data.length; i++) {
        if (parentList.indexOf(data[i].whCode) != -1) {
          data[i].checked = true
        } else {
          data[i].checked = false
        }
      }
      this.$forceUpdate()
    },
    getStockDetailsData() { // 获取库位名称
      const length = this.checkedList.checkList[1].checkList.length + this.checkedList.checkList[2].checkList.length + this.checkedList.checkList[3].checkList.length + this.checkedList.checkList[4].checkList.length + this.checkedList.checkList[5].checkList.length
      const param = {
        type: '',
        page: 1,
        size: 10000,
        distCode: this.productModel.distCode
      }
      retriveLocation(param).then(res => {
        // this.stockDetails.type1 = res.data.list;
        this.stockDetails = {
          type1: [],
          type2: [],
          type3: [],
          type4: [],
          type5: []
        }
        const data = res.data.list
        for (let i = 0; i < data.length; i++) {
          if (data[i].type === '1') {
            this.stockDetails.type1.push(data[i])
          } else if (data[i].type === '2') {
            this.stockDetails.type2.push(data[i])
          } else if (data[i].type === '3') {
            this.stockDetails.type3.push(data[i])
          } else if (data[i].type === '4') {
            this.stockDetails.type4.push(data[i])
          } else if (data[i].type === '5') {
            this.stockDetails.type5.push(data[i])
          }
        }
        if (this.checkedList.checkTypeList.length > 0 || length > 9) {
          this.checkDisabled(this.stockDetails.type1, this.checkedList.checkList[1].checkList)
          this.checkDisabled(this.stockDetails.type2, this.checkedList.checkList[2].checkList)
          this.checkDisabled(this.stockDetails.type3, this.checkedList.checkList[3].checkList)
          this.checkDisabled(this.stockDetails.type4, this.checkedList.checkList[4].checkList)
          this.checkDisabled(this.stockDetails.type5, this.checkedList.checkList[5].checkList)
        }
        this.checkStatus(this.stockDetails.type1, this.checkedList.checkList[1].checkList)
        this.checkStatus(this.stockDetails.type2, this.checkedList.checkList[2].checkList)
        this.checkStatus(this.stockDetails.type3, this.checkedList.checkList[3].checkList)
        this.checkStatus(this.stockDetails.type4, this.checkedList.checkList[4].checkList)
        this.checkStatus(this.stockDetails.type5, this.checkedList.checkList[5].checkList)
      })
    },
    changeDisabled(data) { // 变为禁选
      for (let i = 0; i < data.length; i++) {
        data[i].disabled = true
      }
      this.$forceUpdate()
    },
    changeDisabledFalse(data) { // 变为不禁选
      for (let i = 0; i < data.length; i++) {
        data[i].disabled = false
      }
      this.$forceUpdate()
    },
    onChange(e, code, name, key) { // 库位名称选择
      const current = e.target
      switch (code) {
        case 1:
          this.stockDetails.type1[key].checked = current.checked
          break
        case 2:
          this.stockDetails.type2[key].checked = current.checked
          break
        case 3:
          this.stockDetails.type3[key].checked = current.checked
          break
        case 4:
          this.stockDetails.type4[key].checked = current.checked
          break
        case 5:
          this.stockDetails.type5[key].checked = current.checked
          break
      }
      const index = this.checkedList.checkList[code].checkList.indexOf(current.value)
      if (current.checked) {
        this.checkedList.checkList[code].checkList.push(current.value)
        this.checkedList.checkList[code].checkListName.push(name)
        this.checkedList.checkListName.push(name)
      } else {
        this.checkedList.checkList[code].checkList.splice(index, 1)
        this.checkedList.checkList[code].checkListName.splice(index, 1)
        this.checkedList.checkListName.splice(index, 1)
      }
      this.$forceUpdate()
      const length = this.checkedList.checkList[1].checkList.length + this.checkedList.checkList[2].checkList.length + this.checkedList.checkList[3].checkList.length + this.checkedList.checkList[4].checkList.length + this.checkedList.checkList[5].checkList.length
      if (length > 0) {
        if (this.checkedList.productList.length > 5) {
          this.modelList.map(item => {
            if (this.checkedList.productList.indexOf(item.value) !== -1) {
              item.disabled = false
            } else {
              item.disabled = true
            }
          })
        }
        this.changeDisabled(this.stockType)
        this.productAllStatus = false

        if (this.checkedList.productList.length > 6) {
          this.checkedList.productList = []
          this.modelList.map(item => {
            item.disabled = false
          })
        }
      } else {
        this.modelList.map(item => {
          item.disabled = false
        })
        this.productAllStatus = true
        this.changeDisabledFalse(this.stockType)
      }
      if (length > 9) {
        this.checkDisabled(this.stockDetails.type1, this.checkedList.checkList[1].checkList)
        this.checkDisabled(this.stockDetails.type2, this.checkedList.checkList[2].checkList)
        this.checkDisabled(this.stockDetails.type3, this.checkedList.checkList[3].checkList)
        this.checkDisabled(this.stockDetails.type4, this.checkedList.checkList[4].checkList)
        this.checkDisabled(this.stockDetails.type5, this.checkedList.checkList[5].checkList)
      } else {
        this.changeDisabledFalse(this.stockDetails.type1)
        this.changeDisabledFalse(this.stockDetails.type2)
        this.changeDisabledFalse(this.stockDetails.type3)
        this.changeDisabledFalse(this.stockDetails.type4)
        this.changeDisabledFalse(this.stockDetails.type5)
      }
    },
    handleSubmit() {
      const length = this.checkedList.checkList[1].checkList.length + this.checkedList.checkList[2].checkList.length + this.checkedList.checkList[3].checkList.length + this.checkedList.checkList[4].checkList.length + this.checkedList.checkList[5].checkList.length
      if (length < 1 && this.checkedList.checkTypeList.length < 1) {
        this.$notification['error']({
          message: '提示',
          description: '请选择库位！',
          duration: 4
        })
        return false
      }
      if (length > 0 || this.checkedList.checkTypeList.length > 0) {
        if (this.checkedList.productList.length < 1) {
          this.$notification['error']({
            message: '提示',
            description: '请选择产品型号！',
            duration: 4
          })
          return false
        }
      }
      const arr = []
      this.modelList.map(item => {
        if (this.checkedList.productList.indexOf(item.value) !== -1) {
          arr.push(item.value)
        }
      })
      this.checkedList.productList = arr
      this.sortCheckList()
      this.$emit('ModelStock', this.checkedList)
    },
    sortCheckList () { // 参数排序
      // 库位类型排序
      if (this.checkedList.checkTypeList.length > 0) {
        const list = []
        const listName = []
        this.stockType.map(item => {
          if (this.checkedList.checkTypeList.indexOf(item.whCode) !== -1) {
            list.push(item.whCode)
            listName.push(item.name)
          }
        })
        this.checkedList.checkTypeList = list
        this.checkedList.checkTypeListName = listName
      }
      // 分库位排序
      this.checkedList.checkListName = []
      if (this.checkedList.checkList[1].checkList.length > 0) {
        const Type1Array = []
        const Type1ArrayName = []
        this.stockDetails.type1.map(item => {
          if (this.checkedList.checkList[1].checkList.indexOf(item.whCode) !== -1) {
            Type1Array.push(item.whCode)
            Type1ArrayName.push(item.whName)
            this.checkedList.checkListName.push(item.whName)
          }
        })
        this.checkedList.checkList[1].checkList = Type1Array
        this.checkedList.checkList[1].checkListName = Type1ArrayName
      }
      if (this.checkedList.checkList[3].checkList.length > 0) {
        const Type3Array = []
        const Type3ArrayName = []
        this.stockDetails.type3.map(item => {
          if (this.checkedList.checkList[3].checkList.indexOf(item.whCode) !== -1) {
            Type3Array.push(item.whCode)
            Type3ArrayName.push(item.whName)
            this.checkedList.checkListName.push(item.whName)
          }
        })
        this.checkedList.checkList[3].checkList = Type3Array
        this.checkedList.checkList[3].checkListName = Type3ArrayName
      }
      if (this.checkedList.checkList[2].checkList.length > 0) {
        const Type2Array = []
        const Type2ArrayName = []
        this.stockDetails.type2.map(item => {
          if (this.checkedList.checkList[2].checkList.indexOf(item.whCode) !== -1) {
            Type2Array.push(item.whCode)
            Type2ArrayName.push(item.whName)
            this.checkedList.checkListName.push(item.whName)
          }
        })
        this.checkedList.checkList[2].checkList = Type2Array
        this.checkedList.checkList[2].checkListName = Type2ArrayName
      }
      if (this.checkedList.checkList[4].checkList.length > 0) {
        const Type4Array = []
        const Type4ArrayName = []
        this.stockDetails.type4.map(item => {
          if (this.checkedList.checkList[4].checkList.indexOf(item.whCode) !== -1) {
            Type4Array.push(item.whCode)
            Type4ArrayName.push(item.whName)
            this.checkedList.checkListName.push(item.whName)
          }
        })
        this.checkedList.checkList[4].checkList = Type4Array
        this.checkedList.checkList[4].checkListName = Type4ArrayName
      }
    },
    handleCancel() {
      this.$emit('closeMol')
    },
    handleEmpty() { // 清空产品类型
      this.checkedList.productList = []
      this.modelList.map(item => {
        item.disabled = false
      })
    },
    handleAll () { // 全选
      this.checkedList.productList = []
      this.modelList.map(item => {
        this.checkedList.productList.push(item.value)
      })
    },
    handleEmptyStock() { // 清空库位
      this.productAllStatus = true
      this.modelList.map(item => {
        item.disabled = false
      })
      this.checkedList.checkTypeListName = []
      this.checkedList.checkTypeList = []
      this.checkedList.checkListName = []
      this.checkedList.checkList = {
        1: {
          checkList: [],
          checkListName: []
        },
        2: {
          checkList: [],
          checkListName: []
        },
        3: {
          checkList: [],
          checkListName: []
        },
        4: {
          checkList: [],
          checkListName: []
        },
        5: {
          checkList: [],
          checkListName: []
        }
      }
      this.changeDisabledFalse(this.stockDetails.type1)
      this.changeDisabledFalse(this.stockDetails.type2)
      this.changeDisabledFalse(this.stockDetails.type3)
      this.changeDisabledFalse(this.stockDetails.type4)
      this.changeDisabledFalse(this.stockDetails.type5)
      this.checkStatus(this.stockDetails.type1, [])
      this.checkStatus(this.stockDetails.type2, [])
      this.checkStatus(this.stockDetails.type3, [])
      this.checkStatus(this.stockDetails.type4, [])
      this.checkStatus(this.stockDetails.type5, [])
      this.checkStatus(this.stockType, this.checkedList.checkTypeList)
      this.changeDisabledFalse(this.stockType)
    }
  }
}
</script>
<style lang="less">
  .detailsTitle{
    span{
      font-weight: bold;
      margin: 10px 0;
      display: inline-block;
    }
    .iconfont{
      font-size: 14px;
      margin-left: 20px;
      color: #3e4da8;
      cursor: pointer;
    }
  }
  .proModelWrapSummary{
    h3{
      border-bottom: 1px solid rgba(233, 233, 233, 1);
      padding: 0 0 6px 0;
      margin: 0 0 8px 0;
      small{
        color: rgba(147, 147, 147, 1);
        font-size: 12px;
      }
      .proEmpty{
        float: right;
        margin-left: 20px;
        color: rgba(147, 147, 147, 1);
        .iconfont{
          font-size: 18px;
        }
      }
    }
    .ant-checkbox-wrapper{
      min-width: 140px;
      padding: 4px 0;
      margin-left: 0;
      margin-right: 0;
      width: 20%;
    }
  }
  .stockType{
    .stockTitle{
      float: left;
      width: 20%;
      .ant-checkbox-wrapper{
        width: 100%;
      }
    }
    .stockDetails{
      .ant-checkbox-wrapper{
        width: 20%;
      }
    }
  }

  .ant-checkbox-group{
    padding: 0 0 24px 0;
  }
</style>

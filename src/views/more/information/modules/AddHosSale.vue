<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="24">
        <a-col :md="16" :sm="24">
          <h3>{{ title }}</h3>
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
          </div>
        </a-col>
      </a-row>
    </div>

    <a-form layout="inline" :form="form">
      <div class="basicBorder">
        <a-row :gutter="24">
          <a-col span="8">
            <label for class="basicTitle"><span>*</span>医院名称</label>
            <div class="basicInfo">
              <a-input
                placeholder="请选择医院名称"
                @click="handleSelectCus"
                style="width: 100%;max-width:180px;"
                v-model="proWrap.hosName"
                readOnly
                :disabled="!isHosAdd"
              > <i class="iconfont icon-more" slot="suffix"></i></a-input>
            </div>
          </a-col>
          <!--          <a-col span="8" v-if="!isHosAdd">-->
          <!--            <label for class="basicTitle"><span>*</span>医院名称</label>-->
          <!--            <div class="basicInfo">-->
          <!--              <a-input-->
          <!--                  style="width: 100%;max-width:180px;"-->
          <!--                  v-model="proWrap.hosName"-->
          <!--                  readOnly-->
          <!--                  :diabled="true"-->
          <!--              > <i class="iconfont icon-more" slot="suffix"></i></a-input>-->
          <!--            </div>-->
          <!--          </a-col>-->
          <a-col span="8">
            <label for class="basicTitle"><span>*</span>月份</label>
            <div class="basicInfo">
              <a-month-picker
                placeholder="请选择月份"
                style="width: 100%"
                v-model="proWrap.date"
                :format="format"
                :disabledDate="disabledDate"
              ></a-month-picker>
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
      <div class="scanEmpty" v-if="proList.length === 0">
        <!--        <h4>请在下方选择一种方式添加产品</h4>-->
        <div class="scanInfo">
          <div class="scanList" @click="handleAdd">
            <span class="scanIcon"><i class="iconfont icon-plus" /></span>
            <div class="scanMain" >
              <h3>新增型号</h3>
              <p>点击新增型号及指标</p>
            </div>
          </div>
        </div>
      </div>
      <div class="basicBorder newHosSales" v-if="proList.length > 0">
        <div class="newHosTitle">
          <h3><span>*</span>添加产品型号及指标</h3>
          <span class="newPro" @click="handleAdd">
            <a-tooltip placement="top">
              <template slot="title">
                <span>型号选择</span>
              </template>
              <i class="iconfont icon-plus"></i>
            </a-tooltip>

          </span>
        </div>
        <a-row :gutter="24" v-for="(product,index) in proList">
          <a-col span="16">
            <label for class="basicTitle"><span>*</span>型号</label>
            <div class="basicInfo">
              <a-input
                v-model="product.productType"
                placeholder="请选择产品型号"
                :style="{ width:'240px'}"
                :disabled="true"
              ></a-input>
            </div>
            <label for class="basicTitle"><span>*</span>指标</label>
            <div class="basicInfo">
              <a-form-item style="width: 100%" has-feedback>
                <a-input-number
                  v-model="product.quota"
                  placeholder="指标"
                  :style="{ width:'240px'}"
                  :min="0"
                  :max="99999999"
                  @change="handleInput(product)"
                ></a-input-number>
              </a-form-item>
            </div>
          </a-col>
          <a-col span="8">
            <div class="newProWrap">
              <span class="newPro" @click="handelDel(product)">
                <i class="iconfont icon-empty"></i>
              </span>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <select-cus-name
      v-if="selectShow"
      :visible="selectShow"
      :cusData="selectData"
      @selectCus="handleSelectOk"
      @selectCancle="handleSelectCancle"
    ></select-cus-name>
    <pro-model-list
      v-if="isChooseModel"
      :productModel="modelObj"
      @closeMol="handleMClose"
      @ModelSub="handleMolSub"
    ></pro-model-list>
  </div>
</template>
<script>
import moment from 'moment'
import notification from 'ant-design-vue/es/notification'
import { addLocation, updateLocation, generateCode } from '@/api/information'
import SelectCusName from '@/views/comPublic/modules/SelectCusName'
import { findProductMo, addHosSale, hosQuoAdd, hosQuoDetail, hosQuoUpdate, getProductType } from '@/api/basicInfo/hosData'
import ProModelList from './ProModelList'
export default {
  name: 'AddHosSale',
  props: ['tableData'],
  components: {
    SelectCusName,
    ProModelList
  },
  data () {
    return {
      addBtn: true,
      //   allWarning: false,
      modelList: [],
      proList: [],
      proWrap: {
        hosName: '',
        date: null,
        remark: ''
      },
      selectShow: false,
      selectData: {},
      typeList: [],
      checkList: [],
      format: 'YYYY-MM',
      isChooseModel: false,
      modelObj: {},
      remark: '',
      isHosAdd: true,
      title: '新增医院销售指标'
    }
  },
  // 创建前的生命周期
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.getProModel()
    // console.info('this.tableData', this.tableData)
  },
  methods: {
    // 返回到主页面 子组件调用父组件的方法
    handleBack () {
      this.$emit('handleNewSN', false)
      this.proList = []
      this.proWrap = {
        hosName: '',
        date: null,
        remark: ''
      }
    },
    handleDist () {

    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day')
    },
    getProModel () {
      const params = {
        'productModel': ''
      }
      getProductType(params).then(res => {
        // console.info('res',res)
        const proMol = res.data
        this.proNoList = proMol
        proMol.map((item) => {
          if (this.typeList.findIndex(item => item === item.productType) < 0 && item !== null) {
            this.typeList.push(item.productType)
          }
        })
      })
      // console.info('this.tableData', this.tableData)
      if (this.tableData.id) {
        this.proWrap.hosName = this.tableData.hosName
        this.proWrap.hosCode = this.tableData.hosCode
        this.proWrap.date = moment(this.tableData.year + this.tableData.month, 'YYYY-MM')
        this.proWrap.remark = this.tableData.remark
        this.isHosAdd = false
        this.title = '编辑医院销售指标'
        const params = {
          id: this.tableData.id
        }
        hosQuoDetail(params).then(res => {
          // console.info('res', res)
          if (res.message === 'SUCCESS') {
            this.proList = res.data
          } else {
            this.$notification['error']({
              message: '提示',
              description: '请求异常，请返回列表页重新申请！',
              duration: 4
            })
          }
        })
      } else {
        this.isHosAdd = true
      }
    },
    handleSubmit () {
      const _that = this
      if (!this.isEmptyData(this.proWrap.hosName) && !this.isEmptyData(this.proWrap.date) && this.proList.length > 0) {
        let isAllSel = 0
        // console.info('this.proList====', this.proList)
        this.proList.map(item => {
          if (this.isEmptyData(item.productType) || this.isEmptyData(item.quota)) {
            isAllSel += 1
          }
        })
        if (isAllSel === 0) {
          const submitData = {
            ...this.proWrap,
            date: moment(this.proWrap.date).format('YYYY-MM'),
            detail: this.proList
          }
          // console.info('submitData====', submitData)
          if (this.tableData.id) {
            submitData.id = this.tableData.id
            hosQuoUpdate(submitData).then(res => {
              if (res.message === 'SUCCESS') {
                this.$notification['success']({
                  message: '提示',
                  description: '修改成功！',
                  duration: 4
                })
                _that.handleBack()
              } else {
                this.$notification['error']({
                  message: '提示',
                  description: res.message,
                  duration: 4
                })
              }
            })
          } else {
            hosQuoAdd(submitData).then(res => {
              // console.info('res===', res)
              if (res.message === 'SUCCESS') {
                this.$notification['success']({
                  message: '提示',
                  description: '新增成功！',
                  duration: 4
                })
                _that.handleBack()
              } else {
                this.$notification['error']({
                  message: '提示',
                  description: res.message,
                  duration: 4
                })
              }
            })
          }
        } else {
          this.$notification['error']({
            message: '提示',
            description: '必填信息不能为空！',
            duration: 4
          })
        }
      } else if (this.proList.length === 0) {
        this.$notification['error']({
          message: '提示',
          description: '至少新增一个型号指标！',
          duration: 4
        })
      } else {
        this.$notification['error']({
          message: '提示',
          description: '必填信息不能为空！',
          duration: 4
        })
      }
    },
    isEmptyData (str) {
      // console.info('str===', str)
      // 验证是否为空
      if (str === null || str === undefined || str === '') {
        return true
      }
      return false
    },
    // 删除产品型号
    handelDel (product) {
      // console.info('product====', product, this.proList)
      if (this.typeList.findIndex(item => item === product.productType) === -1) {
        this.typeList.push(product.productType)
      }
      this.proList = this.proList.filter(item => item.productType !== product.productType)
    },
    // 数量控制
    handleInput (e) {
      // console.info('e----', e.quota)
      if (e.quota) {
        const number = e.quota.toString()
        const reg = /[^0-9]/g
        if (reg.test(number) && number !== 0) {
          e.quota = number.replace(/[^0-9]/g, '')
        }
      }
    },
    // 新增产品型号
    handleAdd () {
      if (this.proWrap.hosName && this.proWrap.hosName !== null) {
        this.isChooseModel = true
        const checkData = []
        this.proList.map(item => {
          if (item.productType && (item.productType !== undefined)) {
            checkData.push(item.productType)
          }
        })
        this.modelObj = {
          checkList: checkData,
          modelList: this.typeList,
          visible: true
        }
      } else {
        this.$notification['error']({
          message: '提示',
          description: '请先选择医院名称！',
          duration: 4
        })
      }
    },
    // 选择医院
    handleSelectCus (e) {
      this.selectShow = true
      this.selectData = {
        distCode: this.$store.state.user.info.distCode,
        cusKey: 0,
        cusCode: this.proWrap.hosCode,
        cusName: this.proWrap.hosName,
        type: 'all'
      }
    },
    handleSelectOk (values) {
      // console.info('values====', values)
      this.proWrap.hosName = values.cusName
      this.proWrap.hosCode = values.cusCode
      this.selectShow = false
    },
    handleSelectCancle () {
      this.selectShow = false
    },
    handleSelect (val) {
      // console.info('val-=-----', val)
      this.typeList = this.typeList.filter(item => item !== val)
    },
    handleMClose () {
      this.isChooseModel = false
    },
    handleMolSub (checkList) {
      this.isChooseModel = false
      // console.info('this.proList====', this.proList)
      const newList = []
      checkList.map(item => {
        const checkIndex = this.proList.findIndex(obj => obj.productType === item)
        if (checkIndex === -1) {
          newList.push({
            productId: Date.parse(new Date()),
            productType: item,
            quota: ''
          })
        } else {
          newList.push(this.proList[checkIndex])
        }
      })
      console.info('newList===', newList)
      this.proList = newList
    }
  }
}
</script>
<style lang="less">

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
    .ant-input-affix-wrapper{
      border:none;
    }
    .ant-input,
    .ant-select-selection {
      background: white;
      border: 1px solid rgba(233, 233, 233, 1);
      border-radius: 4px;
    }
    &.newHosSales{
      .newHosTitle{
        width: 100%;
        display: inline-block;
        border-bottom: 1px solid rgba(233, 233, 233, 1);
        h3{
          color: rgba(156, 156, 158, 1);
          font-size: 14px;
          font-weight: bold;
          padding: 16px 40px;
          margin: 0;
          float: left;
          span{
            color: rgba(225, 120, 119, 1);
            padding: 0 8px 0 0;
          }
        }
        .newPro{
          float: right;
          border: none;
          background: none !important;
          padding: 0 40px;
          line-height: 54px;
          border-left: 1px solid rgba(233, 233, 233, 1);
          display: inline-block;
          .iconfont{
            font-size: 20px;
            color: rgba(207, 207, 207, 1);
            cursor: pointer;
          }
          &:hover{
            .iconfont{
              color: rgba(62, 77, 168, 1);
            }
          }
        }
      }

      > .ant-row > div{
        .basicInfo {
          border: none;
        }
        .newProWrap{
          width: 100%;
          display: inline-block;
          margin-right: -12px;
          margin-left: -12px;
          .newPro{
            float: right;
            border: none;
            background: none !important;
            padding: 0 40px;
            line-height: 54px;
            border-left: 1px solid rgba(233, 233, 233, 1);
            display: inline-block;
            .iconfont{
              font-size: 20px;
              color: rgba(207, 207, 207, 1);
              cursor: pointer;
            }
            &:hover{
              .iconfont{
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

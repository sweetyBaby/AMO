<template>
  <a-card :bordered="false">
    <a-spin tip="正在上传中，请耐心等待..." class="uploading" v-show="uploading">
      <a-progress :percent="percent" class="progress" />
    </a-spin>
    <div>
      <div class="pageTitle">
        <a-row :gutter="24">
          <a-col :md="16" :sm="24">
            <h3>医院销售指标详情</h3>
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
                  style="width: 100%;max-width:180px;"
                  v-model="proWrap.hosName"
                  readOnly
                  :disabled="true"
                > <i class="iconfont icon-more" slot="suffix"></i></a-input>
              </div>
            </a-col>
            <a-col span="8">
              <label for class="basicTitle"><span>*</span>月份</label>
              <div class="basicInfo">
                <a-month-picker
                  placeholder="请选择月份"
                  style="width: 100%"
                  v-model="proWrap.date"
                  :format="format"
                  :disabled="true"
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
                  :disabled="true"
                >
                </a-input>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="basicBorder newHosSales" v-if="proList.length > 0">
          <div class="newHosTitle">
            <h3>产品型号及指标</h3>
          </div>
          <a-row :gutter="24" v-for="(product,index) in proList">
            <a-col span="24">
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
                    :disabled="true"
                  />
                </a-form-item>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-form>
    </div>
  </a-card>
</template>
<script>
import moment from 'moment'
import notification from 'ant-design-vue/es/notification'
import { addLocation, updateLocation, generateCode } from '@/api/information'
import { findProductMo, addHosSale, hosQuoAdd, hosQuoDetail, hosQuoUpdate, getProductType, myHosQuoDetail } from '@/api/basicInfo/hosData'
import { getStore } from '@/utils/storage'
export default {
  name: 'AddHosSale',
  props: ['tableData'],
  data () {
    return {
      addBtn: true,
      //   allWarning: false,
      modelList: [],
      proList: [],
      uploading: false,
      percent: 0,
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
      isHosAdd: true
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
      const tableData = getStore('HOSSALES')
      this.$router.push({
        path: tableData.backUrl
      })
      this.proList = []
      this.proWrap = {
        hosName: '',
        date: null,
        remark: ''
      }
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
      const tableData = getStore('HOSSALES').data
      this.proWrap.hosName = tableData.hosName
      this.proWrap.hosCode = tableData.hosCode
      this.proWrap.date = moment(tableData.year + tableData.month, 'YYYY-MM')
      this.proWrap.remark = tableData.remark
      this.isHosAdd = false
      const dataParams = {
        id: tableData.id
      }
      this.handleDetail(dataParams)
    },
    handleDetail (params) {
      const tableData = getStore('HOSSALES')
      if (tableData.type === 'hosSales') {
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
        myHosQuoDetail(params).then(res => {
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
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name.indexOf('_Detail') !== -1) {
        this.getProModel()
      }
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

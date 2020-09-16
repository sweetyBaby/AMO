<template>
  <div class="wareList" >
    <div :class="handleClass(index,item.errorMessage)" v-for="(item,index) in scanDataList" :key="index">

      <div class="card-border"><small>{{ (index + 1) < 10 ? "0" + (index + 1) : ( index + 1 ) }}</small></div>
      <!--     <div class="card_error" v-if="item.errorMessage"></div>-->
      <div class="cardInfo">
        <div class="card_Sn">
          <div class="card-main">
            <span class="card_title">SN</span>
            <p class="card_contant">{{ item.serialNumber ? item.serialNumber : '-' }}</p>
          </div>
        </div>
        <div class="card_left">
          <div class="card-main">
            <span class="card_title">产品名称</span>
            <p class="card_contant proName">{{ item.productName ? item.productName : '-' }}</p>
          </div>
          <div class="card-main">
            <span class="card_title">注册证编号</span>
            <p class="card_contant proName">{{ item.registration ? item.registration : '-' }}</p>
          </div>
          <!--          <span>{{ moment(item.ScanTime).format('HH:mm')}}<small>{{ moment(item.ScanTime).format('ss')}}</small></span>-->
          <!--          <p>{{ moment(item.ScanTime).format('YYYY年MM月DD日')}}</p>-->
        </div>
        <a-row :gutter="24">
          <a-col :span="6">
            <div class="card-main">
              <span class="card_title"> 产品型号</span>
              <p class="card_contant proName">{{ item.productModel ? item.productModel : '-' }}</p>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="card-main">
              <span class="card_title">度数</span>
              <p class="card_contant">{{ item.degree ? ( item.degree === '1000.0' ? '未知度数' : item.degree ): '-' }}</p>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="card-main">
              <span class="card_title">产品批号</span>
              <p class="card_contant">{{ item.batchNumber ? item.batchNumber : '-' }}</p>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="card-main">
              <span class="card_title">数量/单位</span>
              <p class="card_contant">{{ item.qty ? item.qty : 0 }} <span></span> {{ item.uom ? item.uom : '' }}</p>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="card-main">
              <span class="card_title">生产日期</span>
              <p class="card_contant ">{{ item.effectiveDateBegin ? moment(item.effectiveDateBegin).format('YYYY-MM-DD') : '-' }}</p>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="card-main">
              <span class="card_title">失效日期</span>
              <p class="card_contant">{{ item.effectiveDateEnd ? moment(item.effectiveDateEnd).format('YYYY-MM-DD') : '-' }}</p>
            </div>
          </a-col>
          <!--          <a-col :span="6">-->
          <!--            <div class="card-main">-->
          <!--            <span class="card_title">价格</span>-->
          <!--            <p class="card_contant">￥{{ ( item.price > 0 || item.price === 0) ? parseFloat(item.price).toFixed(2) : '-'  }}</p>-->
          <!--            </div>-->
          <!--          </a-col>-->
          <a-col :span="6" v-if="isDelivery || type === 'delivery' || type === 'proAllot'">
            <div class="card-main">
              <span class="card_title">库位名称</span>
              <p class="card_contant">
                <!--                <span class="cardRed" v-if="item.serialNumber && !item.whName && type === 'delivery'"> <a-tag color="orange">强制出库</a-tag></span>-->
                <span class="cardRed" v-if="item.serialNumber && item.force">
                  {{ item.whName }}
                </span>
                <span v-else >{{ item.whName }}</span>
              </p>
            </div>
          </a-col>
          <a-col :span="6" v-if="item.whNameFrom">
            <div class="card-main">
              <span class="card_title">库位名称</span>
              <p class="card_contant">
                <span class="cardRed" v-if="item.serialNumber && item.force">
                  {{ item.whName }}
                </span>
                <span v-else >{{ item.whNameFrom }}</span>
              </p>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="right_btn">
        <span class="titleBtn" v-if="type === 'delivery' && item.force && !item.otherSn" >
          <a-tag color="red">强制出库</a-tag>
        </span>
        <span class="titleBtn title_primary title_blue" v-if="item.consignMark === '1'" >
          寄
        </span>
        <div v-if="!isDetail">
          <span class="titleBtn title_primary" v-if="item.isEdit && item.errorMessage === 'true'">已编辑</span>
          <span class="titleBtn" @click="handleEdit(item,index)">
            <a-tooltip placement="top">
              <template slot="title">
                <span>编辑</span>
              </template>
              <i class="iconfont icon-card-edit" />
            </a-tooltip>
          </span>
          <span class="titleBtn" @click="handleDelete(item)">
            <a-tooltip placement="top">
              <template slot="title">
                <span>删除</span>
              </template>
              <i class="iconfont icon-empty" />
            </a-tooltip>
          </span>
        </div>
      </div>
    </div>
    <edit-scan
      v-if="editData.visible"
      :editData="editData"
      @cancel="handleCancle"
      @ok="handleSubmit"
    >
    </edit-scan>
  </div>
</template>

<script>
import moment from 'moment'
import EditScan from './EditScan'

export default {
  name: 'ScanWare',
  components: {
    EditScan,
    moment
  },
  props: ['scanData', 'type', 'whQueram', 'isDelivery'],
  mounted () {
    // console.info('this.isDelivery---', this.scanData, this.type, this.isDelivery)
    // this.scanDataList = JSON.parse(JSON.stringify(this.scanData))
    if (this.type === 'detail') {
      this.isDetail = true
    }
  },
  data () {
    return {
      orgId: 'MUMDU001',
      isDetail: false,
      editData: {
        visible: false,
        whList: [],
        dataList: {
          id: 'product01',
          productNameCn: '可重复使用直线型切割吻合器和一次性钉仓',
          productModel: 'AR40e',
          serialNumber: '4092571409',
          degree: '27.5D',
          batchNumber: '20180112',
          qty: '1',
          uom: '个',
          scode: '国食药监械（进）字2013第3222864号',
          effectiveDateBegin: '2018-01-12',
          effectiveDateEnd: '2019-09-01',
          registration: 'MIP60005234949'
        },
        isdelivery: ''
      },
      // scanDataList:[]
      isEdit: false
    }
  },
  computed: {
    scanDataList () {
      return this.scanData
    }
  },
  methods: {
    moment,
    handleClass (index, error) {
      // console.info('error---',error)
      const newClassName = ['table_card']
      if (index === 0) {
        newClassName.push('active')
      }
      if (error === 'true') {
        newClassName.push('error')
      }
      // console.info('newClassName',newClassName)
      return newClassName
    },
    handleEdit (val, num) {
      // console.info('this.whQueram---', this.whQueram)
      this.scanDataList.map((item, index) => {
        if (index === num) {
          item.isEdit = true
        }
      })
      this.editData = {
        visible: true,
        dataList: val,
        whList: this.whQueram
      }
      // console.info('this.type===', this.type)
      if (this.type === 'delivery') {
        this.editData.isdelivery = 'delivery'
      } else if (this.type === 'proAllot') {
        this.editData.isdelivery = 'proAllot'
      } else if (this.type === 'replace') {
        this.editData.isdelivery = 'replace'
      } else if (this.type === 'estate') {
        this.editData.isdelivery = 'estate'
      } else {
        this.editData.isdelivery = ''
      }
    },
    handleCancle () {
      this.editData.visible = false
    },
    handleSubmit (val) {
      // console.info('val====', val)
      this.editData.visible = false
      // this.$forceUpdate()
      this.$emit('submit', val)
    },
    handleDelete (item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style lang="less">
  .wareList{
    padding: 36px 16px 0 16px;
    box-sizing: border-box;
    /*height: 100%;*/
  }
  .table_card {
    font-family: 'PingFang SC','Microsoft YaHei';
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 15px rgba(172,173,183,0.15);
    border-radius: 8px;
    padding: 69px 0 18px 16px;
    margin: 0 0 24px 0;
    position: relative;
    .card-border{
      height: 20px;
      border-radius:2px;
      display: block;
      position: absolute;
      left: 16px;
      top: 78px;
      border-right:4px solid rgba(233, 233, 233, 1);
      margin-top: -45px;
      padding: 0 6px 0 0;
      width: 40px;
      text-align: right;
      small{
        font-size: 14px;
        font-weight: normal;
        line-height: 20px;
        color: rgba(207, 207, 207, 1);
      }
    }
    .right_btn {
      position: absolute;
      right: 20px;
      top: 14px;
      & > div{
        display: inline-block;
      }
      .titleBtn{
        margin: 0 0 0 8px;
        cursor: pointer;
        display: inline-block;
        float: left;
        .iconfont{
          font-size: 24px;
          color: rgba(207, 207, 207, 1);
          line-height: 32px;
        }
        &:hover{
          .iconfont{
            color: rgba(62, 77, 168, 1);
          }
        }
        &.title_primary{
          background: rgba(251, 251, 251, 1);
          border-radius: 14px;
          color: rgba(177, 177, 177, 1);
          font-size: 12px;
          padding: 4px 8px;
          line-height: 24px;
        }
        &.title_blue{
          color: rgba(62, 77, 168, 1);
          font-size: 14px;
        }
        &.cardMark{
          font-size: 14px;
          color: rgba(62, 77, 168, 1);
          background: rgba(251, 251, 251, 1);
          border-radius: 14px;
          width: 28px;
          height: 28px;
          line-height: 28px;
          text-align: center;
        }
        .ant-tag{
          margin: 4px;
        }
      }
    }
    .cardInfo {
      width: 100%;
      position: relative;
      padding: 0 0 0 25%;
      box-sizing: border-box;
      .card_Sn{
        position: absolute;
        top: -39px;
        left: 0;
        width: 100%;
        padding: 0 0 0 14px;
        .card-main {
          .card_title {
            width: auto;
            font-size: 18px;
            padding: 0 10px 0 18px;
            float: left;
            line-height: 24px;
            font-weight: bold;
            color: rgba(207, 207, 207, 1);
            small{
              font-size: 14px;
              font-weight: normal;
            }
          }
          .card_contant {
            max-width: inherit;
            float: left;
            font-size: 14px;
            color: rgba(207, 207, 207, 1);
            line-height: 24px;
            height: 28px;
          }
        }
      }
      .card_left{
        position: absolute;
        left: 0;
        top: 0;
        /*span{*/
        /*  font-size: 32px;*/
        /*  color: rgba(207, 207, 207, 1);*/
        /*  font-weight: bold;*/
        /*  line-height: 45px;*/
        /*  small{*/
        /*    font-size: 16px;*/
        /*    display: inline-block;*/
        /*    padding: 0 0 0 8px;*/
        /*  }*/
        /*}*/
        /*p{*/
        /*  color: rgba(207, 207, 207, 1);*/
        /*  font-size: 14px;*/
        /*  margin: 0;*/
        /*}*/
      }
      /*.ant-row .ant-col-6 {*/
        .card-main {
          padding: 0 36px;
          .card_title {
            font-size: 12px;
            color: rgba(177, 177, 177, 1);
            padding: 0 0 4px 0;
          }
          .card_contant {
            font-size: 14px;
            line-height: 20px;
            color: rgba(207, 207, 207, 1);
            max-width: 100%;
            word-break: break-all;
            height: 28px;
            &.proName {
              width: 100%;
              height: 20px;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .card_left {
            width: 4px;
            height: 90px;
            background: rgba(233, 233, 233, 1);
            opacity: 1;
            float: left;

            .card_right {
              margin-left: 44px;
            }
          }
          @media screen and (max-width: 1280px){
            padding: 0 12px;
          }
        }
      /*}*/
    }
    .cardSn{
      position: absolute;
      bottom: 0;
      left: 0;
      background: rgba(244, 244, 245, 1);
      width: 40px;
      height: 22px;
      text-align: center;
      font-size: 12px;
      color: rgba(177, 177, 177, 1);
      border-radius:0px 8px 0px 8px;
      line-height: 22px;
      display: block;
    }
    &:hover,&.active {
      box-shadow:0px 5px 20px rgba(172,173,183,0.3);
      .card-border{
        border-color: rgba(62, 77, 168, 1);
        small{
          color: rgba(62, 77, 168, 1);
        }
      }
      .card_Sn{
        .card-main {
          .card_title {
            color: rgba(62, 77, 168, 1);
          }
          .card_contant {
            color: rgba(62, 77, 168, 1);
          }
        }
      }
      .card-main {
        .card_title {
          color: rgba(177, 177, 177, 1);
        }
        .card_contant {
          color: rgba(52, 53, 62, 1);
        }
      }
      .cardSn{
        background: rgba(251, 251, 251, 1);
        color: rgba(62, 77, 168, 1);
      }
      .cardRed{
        color: red;
      }
    }
    .card_error{
      width: 8px;
      height: 8px;
      border-radius: 4px;
      position: absolute;
      left: 8px;
      top: 8px;
      background: #E17877;
      display: block;
    }
    &.error{
      box-shadow:0px 5px 20px rgba(225,120,119,1);
    }
    .cardRed{
      color: rgba(225, 120, 119, 0.6);
    }
  }
</style>

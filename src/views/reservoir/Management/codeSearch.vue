<template>
  <a-card class="card1" v-if="isEmpty">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="12">
          <h3>唯一码追溯查询</h3>
        </a-col>
      </a-row>
    </div>
    <div class="searchArea">
      <a-input-search placeholder="请输入产品SN码或扫码" ref="emptySearch" @search="onSearch" size="large" v-model="queryParam.serialNumber">
        <a-button slot="enterButton">搜索</a-button>
      </a-input-search>
      <a href="javascript:;">
        <a-popover placement="bottom">
          <template slot="content" class="serialNumber">
            <img :src="imgSrc" alt="">
          </template>
          什么是产品SN
          <i class="iconfont icon-question"/>
        </a-popover>
      </a>
    </div>
  </a-card>
  <a-card class="card2" v-else>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="12">
          <h3>唯一码追溯查询</h3>
        </a-col>
        <a-col :md="12" v-if="isAbNormal">
          <div class="scanInput">
            <div class="icons-list pageTitle-Btn">
              <span class="titleBtn" @click="handleBack">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>返回</span>
                  </template>
                  <i class="iconfont icon-back" />
                </a-tooltip>
              </span>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="searchArea">
      <a-input-search placeholder="请输入产品SN码或扫码" @search="onSearch" size="large" ref="emptySearch" v-model="queryParam.serialNumber">
        <a-button slot="enterButton">搜索</a-button>
      </a-input-search>
    </div>
    <div class="showDetails">
      <a-row>
        <a-col :span="12">
          <div class="showTable">
            <a-row>
              <a-col :span="6"><span>产品名称</span></a-col>
              <a-col :span="18"><span>{{ tableData.productNameCn }}</span></a-col>
            </a-row>
            <a-row>
              <a-col :span="6"><span>产品型号</span></a-col>
              <a-col :span="18"><span>{{ tableData.productModel }}</span></a-col>
            </a-row>
            <a-row>
              <a-col :span="6"><span>产品批号</span></a-col>
              <a-col :span="18"><span>{{ tableData.batchNumber }}</span></a-col>
            </a-row>
            <a-row>
              <a-col :span="6"><span>度数</span></a-col>
              <a-col :span="18"><span>{{ tableData.degree }}</span></a-col>
            </a-row>
            <a-row>
              <a-col :span="6"><span>注册证编号</span></a-col>
              <a-col :span="18"><span>{{ tableData.registration }}</span></a-col>
            </a-row>
            <a-row>
              <a-col :span="6"><span>产品SN</span></a-col>
              <a-col :span="18"><span>{{ tableData.serialNumber }}</span></a-col>
            </a-row>
            <a-row>
              <a-col :span="6"><span>生产日期</span></a-col>
              <a-col :span="18"><span>{{ tableData.effectiveDateBegin }}</span></a-col>
            </a-row>
            <a-row>
              <a-col :span="6"><span>有效日期</span></a-col>
              <a-col :span="18"><span>{{ tableData.effectiveDateEnd }}</span></a-col>
            </a-row>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="productFlow">
            <div v-show="!flowEmpty">
              <div class="flowTitle">
                产品流向
              </div>
              <div class="shu"></div>
              <div>
                <a-steps direction="vertical" size="small">
                  <a-step status="wait" v-for="(item,index) in flowData" :key="index" :title="item.date">
                    <a-icon type="clock-circle" slot="icon"/>
                    <span slot="description">{{ item.str }}</span>
                  </a-step>
                </a-steps>
              </div>
            </div>
            <div class="flowEmpty" v-show="flowEmpty">
              <i class="iconfont icon-listEmpty"></i>
              <p>暂无数据</p>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-card>
</template>

<script>
import moment from 'moment'
import { CodeSearch } from '@/api/depot/depot'
import imgSrc from '@/assets/serialNumber.png'
export default {
  name: 'CodeSearch',
  data() {
    return {
      isEmpty: true,
      flowEmpty: false,
      imgSrc: imgSrc,
      queryParam: {
        serialNumber: ''
      },
      tableData: {
        productNameCn: '',
        productModel: '',
        batchNumber: '',
        registration: '',
        serialNumber: '',
        effectiveDateBegin: '',
        effectiveDateEnd: '',
        degree: '',
        uom: ''
      },
      flowData: [],
      isAbNormal: false,
    }
  },
  computed: {
    sn: function () {
      // console.info('this.$router---', this.$route)
      if (this.$route && this.$route.params && this.$route.params.sn) {
        return this.$route.params.sn
      }
    }
  },
  created() {
    this.getFirst()
  },
  mounted() {
    this.$nextTick((x) => {
      this.$refs.emptySearch.focus()
    })
  },
  methods: {
    moment,
    scan() {
      window.addEventListener('keydown', this.scanWrapper, false)
    },
    // 扫码
    scanWrapper (e) {
      this.getCodeData()
    },
    getCodeData() { // 获取数据
      CodeSearch(this.queryParam).then(res => {
        this.queryParam.serialNumber = ''
        if (res.data.product) {
          this.isEmpty = false
          this.tableData = {
            productNameCn: res.data.product.productName,
            productModel: res.data.product.productModel,
            batchNumber: res.data.product.productBatch,
            registration: res.data.product.registration,
            serialNumber: res.data.product.udi,
            effectiveDateBegin: res.data.product.effectiveDateBegin,
            effectiveDateEnd: res.data.product.effectiveDateEnd,
            degree: res.data.product.degree,
            uom: res.data.product.uom
          }
          this.flowData = []
          const flow = res.data.detailList
          if (flow.length > 0) {
            for (let i = 0; i < flow.length; i++) {
              const str = '发货方：' + flow[i].distName + ' | 收货方：' + flow[i].cusName + ' | 库位名称: ' + flow[i].whName + ' | 操作人: ' + flow[i].createBy + ' | 操作时间：' + moment(flow[i].createTime).format('YYYY-MM-DD HH:mm:ss') + ' | 业务类型：' + flow[i].docTypeName + ' | 数量：' + flow[i].qty
              this.flowData.push({
                date: moment(flow[i].docDate).format('YYYY-MM-DD'),
                str: str
              })
            }
            this.flowEmpty = false
          } else {
            this.flowEmpty = true
          }
        } else {
          this.$notification['error']({
            message: '提示',
            description: '该SN码不存在，请重新输入！',
            duration: 4
          })
          this.getEmpty()
        }
      })
    },
    onSearch() {
      if (this.queryParam.serialNumber === '') {
        this.$notification['error']({
          message: '提示',
          description: '请输入产品SN码或扫码！',
          duration: 4
        })
        return false
      }
      this.getCodeData()
    },
    getEmpty() {
      this.flowEmpty = true
      this.tableData = {
        productNameCn: '',
        productModel: '',
        batchNumber: '',
        registration: '',
        serialNumber: '',
        effectiveDateBegin: '',
        effectiveDateEnd: '',
        degree: '',
        uom: ''
      }
      this.flowData = []
      this.isAbNormal = true
    },
    getFirst() {
      const params = this.$route.params
      // console.info('---',params)
      if (params.sn) {
        this.isEmpty = false
        this.queryParam.serialNumber = params.sn
        this.getCodeData()
        this.isAbNormal = true
      }
    },
    handleBack() {
      this.$router.push({
        name: 'AbnormalData_Detail',
        params: {
        }
      })
    }
  },
  watch: {
    sn: function (val) {
      if (val) {
        this.getFirst()
      }
    }
  },
  destroyed () {
    window.removeEventListener('keydown', this.scanWrapper, false)
  }
}
</script>

<style lang="less" >
  .serialNumber{
    .ant-popover-inner{
      width: auto;
      img{
        padding: 5px;
      }
    }
  }
  /*单输入框页面*/
.ant-card.card1{
  border: none !important;
  .searchArea{
    text-align: center;
    max-width: 600px;
    margin: 170px auto 0 auto;
    a{
      margin-left: 20px;
      color: #939393;
    }
    a:hover{
      color: #3E4DA8;
    }
    .ant-input-search-button:hover{
         color: #3E4DA8;
    }
  }
  .ant-input{
    height:44px !important;
  }
  .ant-btn{
    color:#939393;
    background: #e9e9e9;
    width: 68px;
  }
  .ant-btn-lg{
    height: 44px;
    font-size: 14px;
  }
  .ant-input-affix-wrapper{
    width: 385px;
  }
}

.ant-card.card2{
  border: none !important;
  .showDetails{
    margin-top: 20px;
    .showTable{
      border: 1px solid #e9e9e9;
      border-bottom: none;
      background: #fbfbfb;
      border-radius: 8px 8px 0 0;
      margin-right: 30px;
      .ant-col-6{
        text-align: right;
        span{
          color: #34353E;
          text-align: right;
          font-weight: 400;
        }
      }
      .ant-col-18{
        span{
          color: #939393;
          border-right: none;
        }
      }
      span{
        height: 56px;
        display: inline-block;
        line-height: 56px;
        padding: 0 20px;
        border-right: 1px solid #e9e9e9;
        border-bottom: 1px solid #e9e9e9;
        width: 100%;
        font-size: 14px;
      }
    }

    .productFlow{
      background:rgba(255,255,255,1);
      box-shadow:0px 5px 20px rgba(172,173,183,0.2);
      opacity:1;
      border-radius:8px;
      padding: 20px;
      height: 505px;
      overflow-y: auto;
      .flowEmpty{
        text-align: center;
        .iconfont{
          font-size: 100px;
          color: #f1f1f1;
        }
        p{
          color: #9799a5;
        }
      }
      .flowTitle{
        width:96px;
        height:34px;
        background:rgba(246,246,246,1);
        opacity:1;
        border-radius:22px;
        line-height: 34px;
        text-align: center;
        color: #3E4DA8;
      }
      .shu{
        width:1px;
        height:21px;
        background:#ececec;
        border:1px solid rgba(236,236,236,1);
        opacity:1;
        margin: 5px 0 5px 12px;
      }

      .ant-steps-item-title{
        color: #34353e;
        font-weight:bold !important;
      }
    }
  }

  .searchArea{
    a{
      margin-left: 20px;
      color: #939393;
    }
    a:hover{
      color: #3E4DA8;
    }
       .ant-btn:hover{
       color:#3E4DA8;
   }
  }
  .ant-input{
    height:32px !important;
  }

  .ant-btn{
    color:#939393;
    background: #e9e9e9;
    text-align: center;
  }
  .ant-btn-lg{
    height: 32px;
    /*width: -4px;*/
    font-size: 12px;
    span{
     /* margin-left: -4px;*/
    }
  }
  .ant-input-affix-wrapper{
    width: 385px;
  }
}
</style>

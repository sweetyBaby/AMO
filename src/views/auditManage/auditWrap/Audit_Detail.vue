<template>
  <a-card :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="12">
          <h3>
            <span>审计详情</span>
          </h3>
        </a-col>
        <a-col :md="12">
          <div class="scanInput">
            <div class="icons-list pageTitle-Btn">
              <span class="titleBtn" @click="handlBack()">
                <a-tooltip placement="top" v-model="btn.isBack">
                  <template slot="title">
                    <span>返回</span>
                  </template>
                  <i class="iconfont icon-back"/>
                </a-tooltip>
              </span>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-form layout="inline">
      <div class="mainTitle">发票基本信息</div>
      <div class="basicBorder">
        <a-row :gutter="24">
          <a-col span="8">
            <label for="" class="basicTitle">发票代码</label>
            <div class="basicInfo">
              <p><span>{{ this.getInfo(proInfo.inCode) }}</span></p>
              <p><span class="text-primary">{{ this.getInfo(basicInfo.inCode) }}</span></p>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">发票号码</label>
            <div class="basicInfo">
              <p><span>{{ this.getInfo(proInfo.inNo) }}</span></p>
              <p><span class="text-primary">{{ this.getInfo(basicInfo.inNo) }}</span></p>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">发票日期</label>
            <div class="basicInfo">
              <p><span>{{ this.getInfo(proInfo.inDate, 'date') }}</span></p>
              <p><span class="text-primary">{{ this.getInfo((basicInfo.inDate)) }}</span>
              </p>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">发票类型</label>
            <div class="basicInfo">
              <p><span>{{ this.getInfo(proInfo.inType, 'array') }}</span></p>
              <p><span class="text-primary">{{ this.getInfo(basicInfo.inType, 'array') }}</span></p>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">校验码后6位</label>
            <div class="basicInfo">
              <p><span>{{ this.getInfo(proInfo.verifyCode) }}</span></p>
              <p><span class="text-primary">{{ this.getInfo(basicInfo.verifyCode) }}</span></p>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">不含税总价</label>
            <div class="basicInfo">
              <p><span>{{ this.getInfo(proInfo.noneTaxTotal) }}</span></p>
              <p><span class="text-primary">{{ this.getInfo(basicInfo.noneTaxTotalAmount) }}</span></p>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">含税总价</label>
            <div class="basicInfo">
              <p><span>{{ this.getInfo(proInfo.taxTotal) }}</span></p>
              <p><span class="text-primary">{{ this.getInfo(basicInfo.withTaxTotalAmount) }}</span></p>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">税额</label>
            <div class="basicInfo">
              <p><span>{{ this.getInfo(proInfo.taxAmount) }}</span></p>
              <p><span class="text-primary">{{ this.getInfo(basicInfo.taxAmount) }}</span></p>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">购货方税号</label>
            <div class="basicInfo">
              <p><span>-</span></p>
              <p><span class="text-primary">{{ this.getInfo(basicInfo.cusTaxNo) }}</span></p>
            </div>
          </a-col>
          <a-col span="8" class="maxHeight">
            <label for="" class="basicTitle">销货方税号</label>
            <div class="basicInfo">
              <p><span>-</span></p>
              <p><span class="text-primary">{{ this.getInfo(basicInfo.distTaxNo) }}</span></p>
            </div>
          </a-col>
          <a-col span="8" class="maxHeight">
            <label for="" class="basicTitle">购货方开户行</label>
            <div class="basicInfo">
              <p><span>-</span></p>
              <p><span class="text-primary">{{ this.getInfo(basicInfo.cusBankInfo) }}</span></p>
            </div>
          </a-col>
          <a-col span="8" class="maxHeight">
            <label for="" class="basicTitle">销货方开户行</label>
            <div class="basicInfo">
              <p><span>-</span></p>
              <p><span class="text-primary">{{ this.getInfo(basicInfo.distBankInfo) }}</span></p>
            </div>
          </a-col>

          <a-col span="8" class="maxHeight">
            <label for="" class="basicTitle">购货方名称</label>
            <div class="basicInfo">
              <p><span>{{ this.getInfo(proInfo.cusName) }}</span></p>
              <p><span class="text-primary">{{ this.getInfo(basicInfo.cusName) }}</span></p>
            </div>
          </a-col>
          <a-col span="8" class="maxHeight">
            <label for="" class="basicTitle">销货方名称</label>
            <div class="basicInfo">
              <p><span>{{ this.getInfo(proInfo.distName) }}</span></p>
              <p><span class="text-primary">{{ this.getInfo(basicInfo.distName) }}</span></p>
            </div>
          </a-col>
          <a-col span="8" class="maxHeight">
            <label for="" class="basicTitle">购货方地址</label>
            <div class="basicInfo">
              <p><span>-</span></p>
              <p><span class="text-primary">{{ this.getInfo(basicInfo.cusContactInfo) }}</span></p>
            </div>
          </a-col>
          <a-col span="8" class="maxHeight">
            <label for="" class="basicTitle">销货方地址</label>
            <div class="basicInfo">
              <p><span>-</span></p>
              <p><span class="text-primary">{{ this.getInfo(basicInfo.distContactInfo) }}</span></p>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <div class="proInfo">
      <div class="mainTitle" v-if="fileList && fileList.length > 0">发票图片</div>
      <div class="proImg" v-if="fileList && fileList.length > 0">
        <div class="imgshow" v-for="(item,key) in fileList" :key="key">
          <img :src="item.fileUrl" alt="">
          <div class="mask" @click="imgShow(item.fileUrl)">
            <i class="iconfont icon-enlarge"></i>
          </div>
        </div>
      </div>
      <div class="mainTitle">产品信息</div>
      <a-table
        ref="table"
        size="default"
        rowKey=""
        :pageNum="queryParam.page"
        :pageSize="queryParam.size"
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
        @change="handleTableChange"
      >
      </a-table>
      <div class="mainTitle">票面货物信息</div>
      <a-table
        ref="tableInfo"
        size="default"
        rowKey="id"
        :pageNum="queryParam.ptPage"
        :pageSize="queryParam.ptSize"
        :columns="proColumn"
        :dataSource="proLoadData"
        :pagination="proPagination"
        @change="handleTableProChange"
      >
      </a-table>
    </div>
    <!--       查看图片-->
    <a-modal
      :visible="imgVisible"
      :footer="null"
      @cancel="imgCancel"
      width="660px"
      class="imgModal"
    >
      <img alt="example" style="width: 100%" :src="srcImg"/>
    </a-modal>
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import { invoiceList, getAuditInfo } from '@/api/auditManage/auditManage'
import { DataFilter, saveParamsFromStore, getParamsFromStore } from '@/utils/storage'
import {
  proDetail,
  proAllotDetail,
  getAutoJson,
  getDocumentWhList,
  getDocumentCusList,
  getSuccessAutoJson
} from '@/api/depot/wareHouse'

const proList = [
  {
    id: 'product01',
    productNameCn: '可重复使用直线型切割吻合器和一次性钉仓',
    proType: 'AR40e',
    serialNumber: '4092571409',
    degree: '27.5D',
    batchNumber: '20180112',
    qty: '1',
    uom: '个',
    scode: '国食药监械（进）字2013第3222864号',
    effectiveDateBegin: '2018-01-12',
    effectiveDateEnd: '2019-09-01',
    registration: 'MIP60005234949'
  }]
export default {
  name: 'AuditDetail',
  props: ['infoData'],
  components: {
    STable
  },
  data () {
    return {
      imgVisible: false,
      srcImg: '',
      fileList: [],
      productList: [],
      columns: [
        {
          title: '产品型号',
          dataIndex: 'productModel',
          key: 'productModel',
          width: 100
        }, {
          title: '产品名称',
          dataIndex: 'productName',
          key: 'productName',
          width: 150,
        }, {
          title: '单据号码',
          dataIndex: 'docNo',
          key: 'docNo',
          width: 120,
        }, {
          title: '单价（不含税）',
          dataIndex: 'nonePrice',
          key: 'nonePrice',
          width: 120,
        }, {
          title: '数量',
          dataIndex: 'qty',
          key: 'qty',
          width: 80,
          customRender: (text) => {
            return text ? parseInt(text) : null
          }
        }, {
          title: '单位',
          dataIndex: 'uom',
          key: 'uom',
          width: 100,
        }, {
          title: '总价（不含税）',
          dataIndex: 'nonePriceTotal',
          key: 'nonePriceTotal',
          width: 120,
        }],
      proColumn: [
        {
          title: '产品型号',
          dataIndex: 'productModel',
          key: 'productModel',
          width: 100
        }, {
          title: '产品名称',
          dataIndex: 'productName',
          key: 'productName',
          width: 150,
        }, {
          title: '单据号码',
          dataIndex: 'docNo',
          key: 'docNo',
          width: 120,
        }, {
          title: '单价（不含税）',
          dataIndex: 'price',
          key: 'price',
          width: 120,
        }, {
          title: '数量',
          dataIndex: 'qty',
          key: 'qty',
          width: 80,
          customRender: (text) => {
            return text ? parseInt(text) : null
          }
        }, {
          title: '单位',
          dataIndex: 'uom',
          key: 'uom',
          width: 100,
        }, {
          title: '总价（不含税）',
          dataIndex: 'amount',
          key: 'amount',
          width: 120,
        }],
      queryParam: {
        page: 1,
        size: 10,
        ptPage: 1,
        ptSize: 10
      },
      docType: '进货入库',
      detail: 'detail',
      wareStyle: { 'maxHeight': 'calc(100vh - 160px)' },
      scanDataList: [],
      whNameTo: '',
      isDelivery: false,
      proInfo: {},
      basicInfo: {},
      pageTitle: '',
      backRoute: '',
      routerQuery: {},
      whName: '',
      cusName: '',
      isShowTool: false,
      getParamsRed: {},
      inTypeList: [{}],
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`
      },
      proPagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`
      },
      proLoadData: [],
      loadData: [],
      btn: {
        isBack: false
      }
    }
  },
  created () {
    this.getFirst()
  },
  methods: {
    moment,
    imgCancel () {
      // 取消查看图片
      this.imgVisible = false
    },
    imgShow (url) { // 图片放大
      this.imgVisible = true
      this.srcImg = url
    },
    getInfo (text, type) {
      if (type === 'date') {
        return text ? moment(text).format('YYYY-MM-DD') : '-'
      } else if (type === 'array') {
        switch (text) {
          case '01':
            return '增值税专用发票'
            break
          case '04':
            return '增值税普通发票'
            break
          case '10':
            return '增值税普通发票（电子）'
            break
          default:
            return '-'
            break
        }
      } else {
        return text || '-'
      }
    },
    handlBack () {
      this.$router.push({
        name: 'InvoiceAudit_Edit',
      })
      this.btn.isBack = false
      this.isShowTool = false
    },
    getFirst () {
      const AuditId = getParamsFromStore('AUDITID')
      // console.info('---AuditId----', AuditId)
      const params = {
        id: AuditId,
        ...this.queryParam
      }
      getAuditInfo(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.proInfo = res.data.invoice
          this.basicInfo = res.data.ptBasicInfo ? res.data.ptBasicInfo : {}
          this.loadData = res.data.invoiceProducts.list
          this.pagination = {
            ...this.pagination,
            total: res.data.invoiceProducts ? res.data.invoiceProducts.total : 0
          }
          this.proLoadData = res.data.ptDetailInfos ? res.data.ptDetailInfos.list : []
          this.proPagination = {
            ...this.proPagination,
            total: res.data.ptDetailInfos ? res.data.ptDetailInfos.total : 0
          }
          this.fileList = res.data.fileList ? res.data.fileList.map(item => {
            return {
              uid: item.id,
              name: item.fileName,
              status: 'done',
              url: item.fileUrl,
              fileUrl: item.fileUrl
            }
          }) : []
        }
        // console.info('this.proInfo----', this.proInfo)
      })
    },
    // 分页
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam = {
        ...this.queryParam,
        page: pagination.current,
        size: pagination.pageSize
      }
      this.getFirst()
    },
    handleTableProChange (pagination) {
      this.proPagination.current = pagination.current
      this.proPagination.pageSize = pagination.pageSize
      this.queryParam = {
        ...this.queryParam,
        ptPage: pagination.current,
        ptSize: pagination.pageSize
      }
      this.getFirst()
    },
  },
  watch: {
    $route (to, from) {
      // console.info('to.name===', to.name)
      if (to.name === 'InvoiceAudit_Detail') {
        this.getFirst()
      }
    }
  },
  destroyed () {
    this.btn.isBack = false
  }
}
</script>

<style lang="less" scoped>

  /*详情基本信息*/
  .basicBorder {
    border: 1px solid rgba(233, 233, 233, 1);
    overflow: hidden;
    background: rgba(251, 251, 251, 1);
    border-radius: 0;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    margin: 0;

    > .ant-row {
      > div {
        display: flex;
        flex-wrap: nowrap;
        height: 56px;
        border-bottom: 1px solid rgba(233, 233, 233, 1);
        padding: 0 !important;

        &.maxHeight {
          min-height: 56px;
          height: 84px;
        }

        &.lastBorder {
          label.basicTitle {
            margin-bottom: -1px;
          }

          .basicInfo {
            margin-bottom: -1px;
          }
        }

        label.basicTitle {
          width: 30%;
          flex-grow: 1;
          background: rgba(251, 251, 251, 1);
          text-align: right;
          line-height: 56px;
          padding: 0 12px;
          display: inline-block;
          color: rgba(52, 53, 62, 1);

          small {
            color: red;
            padding: 0 4px 0 0;
          }
        }

        .basicInfo {
          background: white;
          flex-grow: 1;
          width: 70%;
          border-left: 1px solid rgba(233, 233, 233, 1);
          border-right: 1px solid rgba(233, 233, 233, 1);
          display: inline-block;
          padding: 6px 12px;
          color: rgba(52, 53, 62, 1);

          &:nth-child(3n) {
            border-right: none;
          }

          .basicBase {
            line-height: 32px;
          }

          p {
            padding: 0;
            margin: 0;
            line-height: 22px;
          }

          span {
            color: rgba(147, 147, 147, 1);
            line-height: 24px;

            &.text-primary {
              color: rgba(96, 198, 151, 1)
            }
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

  .mainTitle {
    text-align: center;
    background: rgba(251, 251, 251, 1);
    font-size: 14px;
    color: rgba(62, 77, 168, 1);
    font-weight: bold;
    height: 52px;
    line-height: 52px;
    border: 1px solid rgba(233, 233, 233, 1);
    border-bottom: none;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .proInfo {
    padding: 24px 0;
    .proImg{
      margin: 0 0 24px 0;
      width: 100%;
      display: inline-block;
        background: rgba(251, 251, 251, 1);
        border: 1px solid rgba(233, 233, 233, 1);
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;

      .imgshow{
        float: left;
        padding: 8px;
        position: relative;
        img{
          width: 50px;
          height: 50px;
        }
        .mask{
          cursor: pointer;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          heigth: 50px;
          display: block;
          text-align: center;
          line-height: 50px;
        }
      }
    }
  }

</style>

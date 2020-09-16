<template>
  <div :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="12">
          <h3>
            <span>红冲销量详情</span>
          </h3>
        </a-col>
        <a-col :md="12">
          <div class="scanInput">
            <div class="icons-list pageTitle-Btn">
              <span class="titleBtn" @click="handlBack()">
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
    <a-form layout="inline">
      <div class="basicBorder">
        <a-row :gutter="24">
          <a-col span="8">
            <label for class="basicTitle">出库凭证单据号</label>
            <div class="basicInfo">{{ titleData.docNo }}</div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">经销商名称</label>
            <div class="basicInfo">{{ titleData.distName }}</div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">客户名称</label>
            <div class="basicInfo">{{ titleData.cusName }}</div>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="8">
            <label for class="basicTitle">销量月份</label>
            <div class="basicInfo">{{ titleData.cusName }}</div>
          </a-col>
          <a-col span="8" class="borderNone">
            <label for class="basicTitle">单据类型</label>
            <div class="basicInfo">{{ titleData.docType }}</div>
          </a-col>
          <a-col span="8" class="borderNone">
            <label for class="basicTitle">原凭证单据号</label>
            <div class="basicInfo">{{ titleData.docDate }}</div>
          </a-col>
        </a-row>
      </div>
    </a-form>
  </div>
</template>

<script>
import {
  outVoucherDetails
} from '@/api/auditManage/outVoucher'
import moment from 'moment'
export default {
  name: 'VoucherDetails',
  props: ['detailsData'],
  components: {

  },
  data() {
    return {
      titleData: {},
      imgList: [],
      imgVisible: false,
      currentUrl: ''
    }
  },
  created() {
    this.getOutVoucherDetailsData()
  },
  mounted() {

  },
  methods: {

    handleCancel() { // 关闭模态框
      this.imgVisible = false
    },
    getOutVoucherDetailsData() { // 获取详情数据
      const param = {
        documentVoucher: {
          id: this.detailsData
        }
      }
      outVoucherDetails(param).then(res => {
        this.titleData = {
          docNo: res.data.documentVoucher.docNo,
          distName: res.data.documentVoucher.distName,
          cusName: res.data.documentVoucher.cusName,
          docType: res.data.documentVoucher.docType,
          docDate: moment(res.data.documentVoucher.docDate).format('YYYY-MM-DD')
        }
        this.imgList = res.data.fileList
        console.log(this.imgList)
        switch (this.titleData.docType) {
          case '01':
            this.titleData.docType = '进货入库'
            break
          case '02':
            this.titleData.docType = '退货入库'
            break
          case '03':
            this.titleData.docType = '换货入库'
            break
          case '04':
            this.titleData.docType = '调拨入库'
            break
          case '11':
            this.titleData.docType = '销售出库'
            break
          case '12':
            this.titleData.docType = '退货出库'
            break
          case '13':
            this.titleData.docType = '换货出库'
            break
          case '14':
            this.titleData.docType = '报废出库'
            break
          case '15':
            this.detailsData.docType = '污损出库'
            break
          case '16':
            this.titleData.docType = '调拨出库'
            break
          case '20':
            this.titleData.docType = '库位调拨'
            break
          case '30':
            this.titleData.docType = '库存上报'
            break
          default:
            break
        }
      })
    },
    moment,
    handlBack() {
      this.$emit('back')
    }
  }
}
</script>

<style lang="less">
.borderNone {
    border: none !important;
}

/*模态框按钮*/
.imgModal {
    .anticon-close {
        color: #000 !important;
        border: none !important;
    }
}

/*单据凭证*/
.imgList {
    margin-top: 20px;

    h5 {
        font-size: 14px;
        background: #f9f9f9;
        line-height: 52px;
        border-radius: 8px 8px 0px 0px;
        border: 1px solid #efefef;
        padding-left: 20px;
        color: #939393;
    }

    .imgContainer {
        border: 1px solid #efefef;
        margin-top: -7px;
        border-top: none;
        padding: 30px 0;

        .imgshow {
            display: inline-block;
            width: 120px;
            height: 120px;
            border-radius: 4px;
            margin-left: 30px;
            position: relative;

            &:hover {
                .mask {
                    display: block;
                }
            }

            img {
                height: 100%;
                width: 100%;
            }

            .mask {
                height: 100%;
                display: none;
                width: 100%;
                border-radius: 4px;
                background: rgba(0, 0, 0, 0.75);
                position: absolute;
                top: 0;
                left: 0;
                text-align: center;

                .iconfont {
                    cursor: pointer;
                    margin-top: 40px;
                    color: #fff;
                    font-size: 26px;
                    display: inline-block;
                }
            }
        }
    }
}

/*详情基本信息*/
.basicBorder {
    margin-top: 20px;
    border: 1px solid rgba(233, 233, 233, 1);
    overflow: hidden;
    background: rgba(251, 251, 251, 1);
    position: relative;
    border-radius: 8px;

    .deleteInvoice {
        position: absolute;
        right: 20px;
        bottom: 12px;
        border: 1px solid #e9e9e9;
        line-height: 28px;
        padding: 0 10px;
        border-radius: 4px;
        cursor: pointer;
    }

    .deleteInvoice:hover {
        border: 1px solid #3e4da8;
        background: #3e4da8;
        color: #fff;
    }

    >.ant-row {
        >div {
            display: flex;
            flex-wrap: nowrap;
            height: 56px;
            border-bottom: 1px solid rgba(233, 233, 233, 1);
            padding: 0 !important;

            label.basicTitle {
                width: 40%;
                flex-grow: 1;
                background: rgba(251, 251, 251, 1);
                text-align: right;
                line-height: 34px;
                padding: 12px;
                display: inline-block;
                color: rgba(52, 53, 62, 1);
            }

            .basicInfo {
                flex-grow: 1;
                width: 60%;
                border-left: 1px solid rgba(233, 233, 233, 1);
                border-right: 1px solid rgba(233, 233, 233, 1);
                display: inline-block;
                padding: 12px;
                line-height: 34px;
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
}
</style>

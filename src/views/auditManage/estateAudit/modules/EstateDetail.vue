<template>
  <div :style="{ 'position': 'relative'}">
    <div class="scanListAudit">
      <div class="invoiceDelete" @click="editTitleData" v-if="titleDetail.status !== '2' && titleDetail.verifyStatus !== '03' && titleDetail.verifyStatus !== '05'&& !isShowEdit ">
        <a-tooltip placement="top">
          <template slot="title">
            <span>编辑</span>
          </template>
          <i class="iconfont icon-card-edit" />
        </a-tooltip>
      </div>
      <div class="scanListTitle">
        <a-row>
          <a-col :span="5">
            <div class="code" v-if="titleData.inType < 20">
              <span>发票代码</span>
              <b>{{ titleData.inCode }}</b>
            </div>
          </a-col>
          <a-col :span="4">
            <div class="invoiceLine">
              <div></div>
              <div></div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="invoiceType">
              <h3>{{ checkType(titleData.inType) }}</h3>
              <p>开票日期：{{ moment(titleData.inDate).format('YYYY年MM月DD日') }}</p>
            </div>
          </a-col>
          <a-col :span="4">
            <div class="invoiceLine">
              <div></div>
              <div></div>
            </div>
          </a-col>
          <a-col :span="5" v-if="titleData.inType < 20">
            <div class="code" style="text-align: right;">
              <span>发票号码</span>
              <b>{{ titleData.inNo }}</b>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="invoiceTable" v-if="isInvoice">
        <a-row>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="9" class="leftcell" title="销货方">配送商</a-col>
              <a-col :span="15" class="rightcell" :title="titleData.distribution">{{ titleData.distribution }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="9" class="leftcell" title="购货方">购货方</a-col>
              <a-col :span="15" class="rightcell" :title="titleData.cusName">{{ titleData.cusName }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="9" class="leftcell" title="不含税金额">不含税金额</a-col>
              <a-col :span="15" class="rightcell borderRadiusRight" :title="titleData.noneTaxTotal">
                <span v-show="titleData.negative">-</span>
                {{ titleData.noneTaxTotal }}
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8" v-show="titleData.verifyCodeShow">
            <a-row class="tablecell">
              <a-col :span="9" class="leftcell" title="校验码后六位">校验码后六位</a-col>
              <a-col :span="15" class="rightcell" :title="titleData.verifyCode">{{ titleData.verifyCode }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="9" class="leftcell" title="销量月份">销量月份</a-col>
              <a-col :span="15" class="rightcell" :title="titleData.salesYear + '-' + titleData.salesMonth">{{ titleData.salesYear + '-' + titleData.salesMonth }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="9" class="leftcell" title="发票图片" :style="titleData.verifyCodeShow ? '' : 'border-radius:0 0 0 8px'">发票图片</a-col>
              <a-col :span="15" class="rightcell">
                <span class="viewImg" @click="viewImgShow" v-show="titleData.fileUrl">查看图片</span>
              </a-col>
            </a-row>
            <a-modal :visible="previewVisibleTitle" :footer="null" width="660px" class="imgModal" @cancel="titleImgClose">
              <img alt="example" style="width: 100%" :src="titleData.fileUrl" />
            </a-modal>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="9" class="leftcell" title="发票状态">发票状态</a-col>
              <a-col :span="15" class="rightcell" :title="titleData.inStatus === '1' ? '蓝票' : '红票'">{{ titleData.inStatus === '1' ? '蓝票' : '红票' }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="9" class="leftcell" title="备注" :class="titleData.verifyCodeShow ? 'leftcell borderRadiusLeft' : 'leftcell'" :style="remarkSty">备注</a-col>
              <a-col :span="15" class="rightcell" :title="titleData.inRemark" :style="titleData.verifyCodeShow ? 'min-height: 57px; white-space: break-spaces' : 'border-radius:0 0 8px 0'">{{ titleData.inRemark }}</a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
      <div class="invoiceTable" v-if="!isInvoice">
        <a-row>
          <a-col :span="8" v-if="isWareDoc">
            <a-row class="tablecell">
              <a-col :span="9" class="leftcell" title="出入库单号">出入库单号</a-col>
              <a-col :span="15" class="rightcell" :title="titleData.inNo">{{ titleData.inNo }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="8" v-if="isPursure">
            <a-row class="tablecell">
              <a-col :span="9" class="leftcell" title="授权合同">授权合同</a-col>
              <a-col :span="15" class="rightcell" :title="titleData.field2">{{ titleData.field2 }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="9" class="leftcell" title="销货方">配送商</a-col>
              <a-col :span="15" class="rightcell" :title="titleData.distribution">{{ titleData.distribution }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="9" class="leftcell" title="客户名称">客户名称</a-col>
              <a-col :span="15" class="rightcell" :title="titleData.cusName">{{ titleData.cusName }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="8" v-if="isWareDoc || isNoSupport">
            <a-row class="tablecell">
              <a-col :span="9" class="leftcell" title="销量月份">销量月份</a-col>
              <a-col :span="15" class="rightcell" :title="titleData.salesYear + '-' + titleData.salesMonth">{{ titleData.salesYear + '-' + titleData.salesMonth }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="24" v-if="isPursure">
            <a-row class="tablecell">
              <a-col :span="3" class="leftcell" title="销量月份">销量月份</a-col>
              <a-col :span="21" class="rightcell" :title="titleData.salesYear + '-' + titleData.salesMonth">{{ titleData.salesYear + '-' + titleData.salesMonth }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="24" v-if="isNoSupport">
            <a-row class="tablecell">
              <a-col :span="3" class="leftcell" title="备注">备注</a-col>
              <a-col :span="21" class="rightcell" :title="titleData.inRemark" :style="remarkSty">{{ titleData.inRemark }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="16" v-if="isWareDoc">
            <a-row class="tablecell">
              <a-col :span="3" class="leftcell" title="备注">备注</a-col>
              <a-col :span="21" class="rightcell" :title="titleData.inRemark" :style="remarkSty">{{ titleData.inRemark }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="24" v-if="isWareDoc || isNoSupport">
            <a-row class="tablecell">
              <a-col :span="3" class="leftcell" title="单据凭证">单据凭证</a-col>
              <a-col :span="21" class="rightcell">
                <!--                <span class="viewImg" @click="viewImgShow" v-show="titleData.imgShow">查看图片</span>-->
                <div class="imgshow" v-for="(item,key) in fileList" :key="key">
                  <img :src="item.fileUrl" alt />
                  <div class="mask" @click="imgShow(item.fileUrl)">
                    <i class="iconfont icon-enlarge"></i>
                  </div>
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </div>
    <a-tooltip v-if="titleData.inType < 20">
      <template slot="title">{{ errMsg === null ? '验真通过': errMsg }}</template>
      <a href="javascript:;" class="iconCheck">
        <i class="iconfont check" :class="checkClass"></i>
      </a>
    </a-tooltip>
    <!--       查看图片-->
    <a-modal :visible="imgVisible" :footer="null" @cancel="imgCancel" width="660px" class="imgModal">
      <img alt="example" style="width: 100%" :src="srcImg" />
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'EstateDetail',
  props: ['titleDetail'],
  mounted() {
    this.titleData = JSON.parse(JSON.stringify(this.titleDetail))
    const yearMonth = this.titleData.date
    const salesYear = this.titleData.salesYear
    const salesMonth = this.titleData.salesMonth
    this.titleData.salesYear = salesYear || (yearMonth ? yearMonth.split('-')[0] : '')
    this.titleData.salesMonth = salesMonth || (yearMonth ? yearMonth.split('-')[1] : '')
    this.pullData = JSON.parse(JSON.stringify(this.titleDetail))
    this.getFirst()
    this.fileList = this.titleDetail.fileId
    this.isAddPermission = this.titleData.isShowEdit
  },
  data() {
    return {
      titleData: {},
      previewVisibleTitle: false,
      errMsg: '',
      pullData: {},
      imgVisible: false,
      srcImg: '',
      isEdit: false,
      reportType: '',
      isInvoice: true,
      isWareDoc: false,
      isPursure: false,
      isNoSupport: false,
      isShowEdit: false,
      checkClass: '',
      isAddPermission: false,
      fileList: [],
      remarkSty: 'min-height: 57px;white-space: break-spaces'
    }
  },
  methods: {
    moment,
    editTitleData() {
      this.$emit('edit')
    },
    imgShow(url) { // 图片放大
      this.imgVisible = true
      this.srcImg = url
    },
    viewImgShow() {
      // 查看图片
      this.srcImg = this.titleData.fileUrl
      this.imgVisible = true
    },
    imgCancel() {
      // 取消查看图片
      this.imgVisible = false
    },
    titleImgClose() {
      // 关闭title图片
      this.previewVisibleTitle = false
    },

    checkStyle(record) {
      if (record.verifyStatus === '03') {
        this.checkClass = 'icon-AuditPass'
      } else if (record.verifyStatus === '02') {
        if (record.verifyErrCode === '2000' || record.verifyErrCode === '3000') {
          this.checkClass = 'icon-AuditUnPass'
        } else {
          this.checkClass = 'iconCheckUnpass'
        }
      } else if (record.verifyStatus === '01') {
        if (record.verifyErrCode === '1108') {
          this.checkClass = 'iconNationTax'
        } else {
          this.checkClass = 'iconCheckAbnormal'
        }
      }
    },
    checkType(inType) {
      // console.info('inType====', inType)
      switch (inType) {
        case '01':
          this.titleData.verifyCodeShow = false
          this.isInvoice = true
          return '增值税专用发票'
          break
        case '04':
          this.titleData.verifyCodeShow = true
          this.isInvoice = true
          return '增值税普通发票'
          break
        case '10':
          this.titleData.verifyCodeShow = true
          this.isInvoice = true
          return '增值税普通发票（电子）'
          break
        case '97':
          this.titleData.verifyCodeShow = true
          this.isInvoice = true
          return '机打发票'
          break
        case '98':
          this.titleData.verifyCodeShow = true
          this.isInvoice = true
          return '冠名票'
          break
        case '99':
          this.titleData.verifyCodeShow = true
          this.isInvoice = true
          return '手术植入单'
          break
        case '20':
          this.titleData.verifyCodeShow = true
          this.isInvoice = false
          this.isWareDoc = true
          this.isPursure = false
          this.isNoSupport = false
          this.isShowEdit = true
          return '出入库单凭证'
          break
        case '30':
          this.titleData.verifyCodeShow = true
          this.isInvoice = false
          this.isWareDoc = false
          this.isPursure = true
          this.isNoSupport = false
          this.isShowEdit = true
          return '合同附件'
          break
        case '40':
          this.titleData.verifyCodeShow = true
          this.isInvoice = false
          this.isWareDoc = false
          this.isPursure = false
          this.isNoSupport = true
          this.isShowEdit = true
          return '无附件支持'
          break
      }
    },
    verifyErrCode(val) {
      const verifyErrCode = val.verifyErrCode
      if (verifyErrCode === '1008') {
        this.errMsg = '查验结果不一致。请检查发票信息是否正确，修改后进行验真'
      } else if (verifyErrCode === '1009') {
        this.errMsg = '开票日期超过一年。请检查发票信息是否正确，修改后进行验真'
      } else if (verifyErrCode === '1000') {
        this.errMsg = '发票已作废。请检查发票信息是否正确，修改后进行验真'
      } else if (verifyErrCode === '1007') {
        this.errMsg = '发票日期为当天。请48h后可查看验真结果'
      } else if (verifyErrCode === '1010') {
        this.errMsg = '超过该张票当天查验次数，请隔天查看验真结果'
      } else if (verifyErrCode === '1108') {
        this.errMsg = '查验异常。个别地区税务数据在维护，请隔天查看验真结果'
      } else if (verifyErrCode === '1004') {
        this.errMsg = '发票不存在'
      } else if (verifyErrCode === '0000') {
        this.errMsg = '查验通过'
      } else {
        this.errMsg = val.verifyErrMsg || '系统异常，请稍后查看验真结果'
      }
    },
    getFirst() {
      this.pullData = JSON.parse(JSON.stringify(this.titleDetail))
      this.checkType(this.pullData)
      this.checkStyle(this.pullData)
      this.verifyErrCode(this.pullData)
      // this.titleData.inStatus = this.pullData.inStatus === "1" ? '蓝票': '红票'
    }
  },
  watch: {
    titleDetail(newVal) {
      this.isShowEdit = false
      this.checkStyle(newVal)
      this.checkType(newVal)
      this.verifyErrCode(newVal)
      if (!newVal.isShowEdit) {
        if (+newVal.inType < 20 && newVal.verifyStatus === '03') {
          this.isShowEdit = false
        }
        if (+newVal.inType > 19 || newVal.verifyStatus === '02') {
          this.isShowEdit = true
        }
      } else {
        this.isShowEdit = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.iconCheck {
    position: absolute;
    display: inline-block;
    right: 8px;
    // top: 215px;
    bottom: -17px;

    .check {
        font-size: 66px;
        opacity: 0.7;
    }

    .iconCheckUnpass,
    .icon-AuditUnPass {
        color: #e17877;
    }

    .iconcheckPass,
    .icon-AuditPass {
        color: #60c697;
    }

    .iconCheckAbnormal {
        color: #fbc773;
    }
}

.iconCheck:hover {
    .check {
        opacity: 1;
    }
}

/*发票信息*/
.scanListAudit {
    ::-webkit-input-placeholder {
        /* Chrome/Opera/Safari */
        color: #939393;
    }

    ::-moz-placeholder {
        /* Firefox 19+ */
        color: #939393;
    }

    :-ms-input-placeholder {
        /* IE 10+ */
        color: #939393;
    }

    :-moz-placeholder {
        /* Firefox 18- */
        color: #939393;
    }

    .ant-tooltip-placement-top {
        top: 216.8px;
    }

    margin-top: 20px;
    padding: 30px 20px;
    box-shadow: 0px 5px 20px rgba(227, 227, 238, 1);
    border-radius: 8px;
    position: relative;

    .invoiceDelete {
        position: absolute;
        right: 20px;
        top: 10px;
        cursor: pointer;

        .iconfont {
            font-size: 24px;
            color: #cfcfcf;
            line-height: 1;

            &:hover {
                color: #3e4da8;
            }
        }
    }

    .scanListTitle {
        .code {
            margin-left: 10px;
            white-space: nowrap;

            span {
                font-size: 12px;
                color: #939393;
                line-height: 17px;
                position: relative;
                top: -2px;
                margin-right: 10px;
            }

            b {
                font-size: 18px;
                line-height: 33px;
                color: #939393;
            }
        }

        .checkCode {
            margin-left: 10px;
            white-space: nowrap;

            span {
                font-size: 14px;
                color: #3e4da8;
                line-height: 17px;
                margin-right: 10px;
            }

            b {
                font-size: 14px;
                line-height: 33px;
                color: #3e4da8;
            }
        }

        .invoiceLine {
            width: 100%;
            margin-top: 15px;

            div {
                width: 100%;
                height: 1px;
                background: #efefef;
                margin: 4px 0;
            }
        }

        .invoiceType {
            text-align: center;

            h3 {
                color: #3e4da8;
                font-size: 18px;
                font-weight: bold;
                position: relative;
                top: -12px;
                margin-bottom: 0;
            }

            p {
                color: #939393;
                font-size: 14px;
                position: relative;
                top: -10px;
            }
        }
    }

    /*详情基本信息*/
    .invoiceTableManual {
        margin-left: 10px;
        border: 1px solid #e9e9e9;
        border-right: none;
        border-bottom: none;
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        border-radius: 8px;
        background: #fbfbfb;
        line-height: 56px;
        position: relative;

        .errorInvoice {
            position: absolute;
            right: 150px;
            bottom: 12px;
            line-height: 28px;
            padding: 0 10px;
            color: #f00;
            font-size: 24px;
        }

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

        .ant-row {
            margin: 0 !important;
        }

        .ant-col-8 {
            padding: 0 !important;
        }

        .tablecell {
            >div {
                border-right: 1px solid #e9e9e9;
                border-bottom: 1px solid #e9e9e9;
            }

            .leftcell {
                text-align: right;
                padding: 0 12px;
                font-size: 14px;
                color: #34353e;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;

                .mustFill {
                    color: #e17877;
                    margin-right: 5px;
                }
            }

            .rightcell {
                text-align: left;
                padding: 12px;
                line-height: 57px;

                .priceNegative {
                    position: absolute;
                    left: 4px;
                }

                .ant-form-item-control-wrapper {
                    width: 100%;
                    margin-top: 12px;
                }

                .ant-upload {
                    cursor: pointer;
                    width: auto;

                    &:hover {
                        color: #3e4da8;
                    }
                }

                .imgMsg {
                    margin-right: 20px;
                    cursor: pointer;

                    &:hover {
                        color: #3e4da8;
                    }
                }

                .ant-row {
                    margin-top: 10px;
                }
            }
        }
    }

    .invoiceTable {
        margin-left: 10px;
        border: 1px solid #e9e9e9;
        border-right: none;
        border-bottom: none;
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        border-radius: 8px;
        background: #fbfbfb;
        line-height: 56px;
        height: auto;

        .tablecell {
            div {
                border: none;
            }

            .leftcell {
                text-align: right;
                padding: 0 15px;
                font-size: 14px;
                color: #34353e;
                border-right: 1px solid #e9e9e9;
                border-bottom: 1px solid #e9e9e9;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .rightcell {
                text-align: left;
                padding: 0 20px;
                height: 57px;
                border-right: 1px solid #e9e9e9;
                border-bottom: 1px solid #e9e9e9;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;

                .viewImg {
                    cursor: pointer;

                    &:hover {
                        color: #3e4da8;
                    }
                }
            }
        }
    }
}

.imgshow {
    float: left;
    padding: 0 8px 0 0;
    position: relative;

    img {
        width: 50px;
        height: 50px;
    }

    .mask {
        cursor: pointer;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        heigth: 100%;
        display: block;
        text-align: center;
    }
}
</style>

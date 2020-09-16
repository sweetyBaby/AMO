<template>
  <div style="{ 'position': 'relative'}">
    <a-spin tip="数据加载中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="scanListAudit" v-if="!loadingSpin">
      <!--      <div class="invoiceDelete" @click="editTitleData">-->
      <!--        <a-tooltip placement="top">-->
      <!--          <template slot="title">-->
      <!--            <span>编辑</span>-->
      <!--          </template>-->
      <!--          <i class="iconfont icon-card-edit"/>-->
      <!--        </a-tooltip>-->
      <!--      </div>-->
      <div class="scanListTitle">
        <a-row>
          <a-col :span="5"></a-col>
          <a-col :span="4">
            <div class="invoiceLine">
              <div></div>
              <div></div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="invoiceType">
              <h3>{{ title }}</h3>
              <p>单据日期：{{ moment(titleData.docDate).format('YYYY年MM月DD日') }}</p>
            </div>
          </a-col>
          <a-col :span="4">
            <div class="invoiceLine">
              <div></div>
              <div></div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="invoiceTable">
        <a-row>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="6" class="leftcell" title="出入库单号">出入库单号</a-col>
              <a-col :span="18" class="rightcell" :title="titleData.docNo">{{ titleData.docNo }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="6" class="leftcell" title="销货方">销货方</a-col>
              <a-col :span="18" class="rightcell" :title="titleData.distName">{{ titleData.distName }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="6" class="leftcell" title="客户名称">客户名称</a-col>
              <a-col :span="18" class="rightcell" :title="titleData.cusName">{{ titleData.cusName }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="6" class="leftcell" title="单据类型">单据类型</a-col>
              <a-col :span="18" class="rightcell" :title="titleData.docType === '02' ? '退货入库' : '销售出库' ">{{ titleData.docType === '02' ? '退货入库' : '销售出库' }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="6" class="leftcell" title="销量月份">销量月份</a-col>
              <a-col :span="18" class="rightcell" title="销量月份">{{ titleData.salesYear + '-' + titleData.salesMonth }}</a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-row class="tablecell">
              <a-col :span="6" class="leftcell" title="备注">备注</a-col>
              <a-col :span="18" class="rightcell" title="备注">{{ titleData.remark }}</a-col>
            </a-row>
          </a-col>
          <!--          <a-col :span="8"><div class="tableEmpty"></div></a-col>-->
          <a-col :span="16">
            <a-row class="tablecell">
              <a-col :span="3" class="leftcell" title="单据凭证">单据凭证</a-col>
              <a-col :span="21" class="rightcell">
                <div class="imgshow" v-for="(item,key) in fileList" :key="key">
                  <img :src="item.fileUrl" alt />
                  <div class="mask" @click="imgShow(item.fileUrl)">
                    <i class="iconfont icon-enlarge"></i>
                  </div>
                </div>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <div class="tableEmpty"></div>
          </a-col>
        </a-row>
      </div>
    </div>
    <!--       查看图片-->
    <a-modal :visible="imgVisible" :footer="null" @cancel="imgCancel" width="660px" class="imgModal">
      <img alt="example" style="width: 100%" :src="srcImg" />
    </a-modal>
  </div>
</template>

<script>
import {
  outVoucherDetails
} from '@/api/auditManage/outVoucher'
import {
  getStore
} from '@/utils/storage'
import moment from 'moment'
export default {
  name: 'EstateDetail',
  props: ['titleDetail'],
  created() {
    this.titleData = getStore(this.titleDetail)
    this.pullData = getStore(this.titleDetail)
    this.getDetails()
    console.info('', this.titleDetail)
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
      title: '出入库单凭证',
      loadingSpin: true,
      fileList: [],
      uploadData: {
        fileType: 21,
        uploadType: 1,
        correlationId: ''
      }
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
    uploadPreview(file) {
      // console.info('file===', file)
      this.previewImage = file.response.data.fileUrl
      this.previewVisible = true
    },
    imgCancel() {
      // 取消查看图片
      this.imgVisible = false
    },
    titleImgClose() {
      // 关闭title图片
      this.previewVisibleTitle = false
    },
    getDetails() {
      const param = {
        documentVoucher: {
          id: this.titleDetail.id
        }
      }
      outVoucherDetails(param).then(res => {
        if (res.message === 'SUCCESS') {
          this.titleData = {
            ...this.titleData,
            ...res.data.documentVoucher
          }
          this.$emit('handleType', res.data.documentVoucher.docType)
          this.fileList = res.data.fileList.map(item => {
            return {
              uid: item.id,
              name: item.fileName,
              status: 'done',
              url: item.fileUrl,
              fileUrl: item.fileUrl
            }
          })
          this.loadingSpin = false
        } else {
          this.$notification['error']({
            message: '提示',
            description: res.message || '数据加载中，请稍后',
            duration: 4
          })
        }
      })
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

    .iconCheckUnpass {
        color: #e17877;
    }

    .iconcheckPass {
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

:global {
    .ant-upload-list {
        /deep/ .anticon-delete {
            display: none !important;
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

.tableEmpty {
    display: block;
    height: 57px;
    width: 100%;
    border-right: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
}
</style>

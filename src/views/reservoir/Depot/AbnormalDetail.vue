<template>
  <a-card :bordered="false">
    <a-spin tip="正在上传中，请耐心等待..." class="uploading" v-show="uploading">
      <a-progress :percent="percent" class="progress" />
    </a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>异常数据详情</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handlBack()">
              <a-tooltip placement="top" v-model="isShowBack">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back" />
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleSearch()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>展开搜索</span>
                </template>
                <i class="iconfont icon-search" />
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-drawer
        title="搜索条件"
        placement="right"
        @close="onSearchClose"
        :visible="isShowSearch"
        wrapClassName="searchWrap"
        width="340"
      >
        <a-form layout="inline">
          <div class="searchWrap">
            <div class="searchList">
              <label for>产品型号</label>
              <a-input v-model="queryParam.productModel" placeholder="请输入产品型号" />
            </div>
            <div class="searchList" style="width: 100%;">
              <label for>度数</label>
              <a-input v-model="queryParam.degree" placeholder="请输入度数" />
            </div>
            <div class="searchList" style="width: 100%;">
              <label for>SN</label>
              <a-input v-model="queryParam.serialNumber" placeholder="请输入SN" />
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="tableSearch" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetTable" size="small">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <s-table
        :columns="columns"
        :data="loadData"
        rowKey="key"
        ref="table"
        size="default"
        :pageSize="queryParam.size"
        :pageNum="queryParam.page"
        :locale="{emptyText:emptyText}"
        :scroll="proScroll"
      >
        <span slot="pathto" slot-scope="record">
          <a @click="handlePathTo(record.serialNumber)"> {{ record.serialNumber ? '查看流向': null }}</a>
        </span>

        <!--        <span slot="docNo">-->
        <!--          {{ queryParam.docNo }}-->
        <!--        </span>-->

        <template slot="name" slot-scope="name">
          <a-tooltip placement="top" :title="name">
            <span class="serialWrap">{{ name }}</span>
          </a-tooltip>
        </template>
      </s-table>
    </div>
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import { STable } from '@/components'
import { DataFilter, saveParamsFromStore, getParamsFromStore } from '@/utils/storage'
import { getInOutDetailByDocNo, userDistRange } from '@/api/depot/wareHouse'
import moment from 'moment'

export default {
  name: 'AbnormalDetail',
  props: ['data'],
  components: {
    STable,
    DhEmpty
  },
  data() {
    const getParams = this.$route.params
    return {
      emptyText: <dh-empty/>,
      percent: 0,
      uploading: false,
      showUploadList: false,
      errorShow: false,
      isShowSearch: false,
      isShowBack: false,
      columns: [
        {
          title: '流向查询',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'pathto' },
        },
        {
          width: 250,
          title: '单据号码',
          key: 'docNo',
          dataIndex: 'docNo'
        },
        {
          width: 120,
          title: '单据日期',
          key: 'docDate',
          dataIndex: 'docDate',
          customRender: (text) => {
            return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          width: 120,
          title: '产品型号',
          key: 'productModel',
          dataIndex: 'productModel'
        },
        {
          width: 100,
          title: '产品名称',
          key: 'productName',
          dataIndex: 'productName',
          scopedSlots: {
            customRender: 'name'
          },
        },
        {
          width: 120,
          title: '批号',
          key: 'batchNumber',
          dataIndex: 'batchNumber'
        },
        {
          width: 140,
          title: '度数',
          key: 'degree',
          dataIndex: 'degree',
          customRender: (text) => {
            return text === '1000.0' ? '未知度数' : text
          }
        },
        {
          width: 100,
          title: 'SN',
          key: 'serialNumber',
          dataIndex: 'serialNumber',
          scopedSlots: {
            customRender: 'name'
          },
        },
        {
          width: 120,
          title: '生产日期',
          key: 'effectiveDateBegin',
          dataIndex: 'effectiveDateBegin',
          customRender: (text) => {
            return text ? moment(text).format('YYYY-MM-DD') : null
          }
        },
        {
          width: 120,
          title: '失效日期',
          key: 'effectiveDateEnd',
          dataIndex: 'effectiveDateEnd',
          customRender: (text) => {
            return text ? moment(text).format('YYYY-MM-DD') : null
          }
        },
        {
          width: 100,
          title: '注册证号',
          key: 'registration',
          dataIndex: 'registration',
          scopedSlots: {
            customRender: 'name'
          },
        },
        // {
        //   width: 100,
        //   title: "归属",
        //   key: "distName",
        //   dataIndex: "distName",
        //   scopedSlots:{
        //     customRender:'name'
        //   },
        // },
        {
          width: 200,
          title: '最后操作时间',
          key: 'createTime',
          dataIndex: 'createTime',
          customRender: (text) => {
            return moment(text).format('YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          width: 140,
          title: '最后操作人',
          key: 'createBy',
          dataIndex: 'createBy'
        },
        {
          title: '异常原因',
          key: 'errorDesc',
          dataIndex: 'errorDesc'
        }
      ],
      queryParam: {
        page: getParams.page ? getParams.page : 1,
        size: getParams.size ? getParams.size : 10,
      },
      query: {},
      proScroll: {
        x: '1900px'
      },
      getParamsRed: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getInOutDetailByDocNo(Object.assign(this.queryParam, parameter)).then(res => {
          const abnormalList = DataFilter(res, 'abnormalDetail')
          this.queryParam.size = res.data.pageSize
          return abnormalList
        }
        )
      }
    }
  },
  created() {
    this.getFirstList()
  },
  methods: {
    moment,
    getFirstList() {
      // console.info('this.$route---',this.$route)
      // const getParams = this.$route.params
      let getParams
      if (this.$route.params.item) {
        getParams = this.$route.params
        saveParamsFromStore(getParams)
        this.getParamsRed = getParams
      } else {
        getParams = getParamsFromStore('ABNORMAL')
        // console.info( getParamsFromStore())
        this.getParamsRed = getParamsFromStore('ABNORMAL')
      }
      // console.info('getParams---',getParams)
      this.query = getParams
      this.queryParam.docNo = getParams.item.docNo
    },
    // 点击输入框弹出弹框
    tableSearch() {
      // 表格搜索
      this.$refs.table.refresh(false)
      this.isShowSearch = false
    },
    refreshTable() {
      this.$refs.table.refresh(false)
    },
    resetTable() {
      // 重置查询条件
      this.queryParam = {
        ...this.queryParam,
        productModel: '',
        degree: '',
        serialNumber: ''
      }
    },
    handlBack() {
      // this.$emit('back')
      const getParams = this.$route.params
      this.$router.push({
        name: 'AbnormalData',
        params: {
          ...this.query
        }
      })
      this.isShowBack = false
    },
    handleSearch() {
      // 搜索展开
      this.isShowSearch = true
    },
    onSearchClose() {
      // 关闭搜索
      this.isShowSearch = false
    },
    handlePathTo(serialNum) {
      // console.info('serialNum---',serialNum)
      this.$router.push({
        name: 'codeSearch',
        params: {
          sn: serialNum
        }
      })
    }
  },
  watch: {
    $route(to) {
      // console.info('to---',to)
      if (to.path.indexOf('AbnormalData_Detail') !== -1) {
        if (to.params.item) {
          console.info('to.params.query===', to.params)
          this.query = to.params
          this.getFirstList()
          this.$refs.table.refresh(false)
        }
      }
    }
  }
}
</script>

<style lang="less">
.progress {
  width: 500px;
  margin: 0 auto;
  margin-top: 250px;
  display: block;
  .ant-progress-text {
    color: #fff;
  }
}
.ant-spin-blur {
  opacity: 1;
}
.ant-spin-blur:after {
  opacity: 0.5;
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

.ant-card-bordered {
  border: none !important;
}
.downloadFile:hover {
  color: #3e4da8;
  cursor: pointer;
}
.ant-upload {
  width: 100%;
}
.addInput {
  .addInput-title {
    padding: 0 0 8px 0;
    font-size: 14px;
  }
}
.ant-modal {
  .ant-table-thead {
    td {
      background: none;
    }
  }
}
.serialWrap{
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}
.ant-popover-inner-content a {
  display: block;
  height: 38px;
  line-height: 38px;
  padding-left: 31px;
  color: #939393;
  &:hover{
    color: #153aaf;
    background: #f6f6f8;
  }
}
/* 搜索样式 */
.searchWrap {
  .selectDistName {
    input {
      cursor: pointer;
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
            background: #fff;
            height: 44px;
            line-height: 44px;
            .ant-calendar-picker {
              line-height: 36px;
            }
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
                background: #fff;
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
.tableBtn .ant-popover-title{
  padding: 0;
  min-width:160px;
  a{
    width: 100%;
    padding: 8px 0 8px 32px;
    color: rgba(147, 147, 147, 1);
    display: inline-block;
    box-sizing: border-box;
    .iconfont{
      font-size: 19px;
      color: rgba(147, 147, 147, 1);
      padding: 0 12px 0 0;
    }
    &:hover{
      background: rgba(246, 246, 248, 1);
      color: rgba(21, 58, 175, 1);
      .iconfont{
        color: rgba(21, 58, 175, 1);
      }
    }
  }
}
</style>

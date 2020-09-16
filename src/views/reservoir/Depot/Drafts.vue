<template>
  <a-card :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>草稿箱</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <!--<a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>-->
          <div class="icons-list pageTitle-Btn">
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
    <div v-if="!isEmpty">
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
              <label for="">输入单据号</label>
              <a-input v-model="queryParam.docNo" placeholder="输入单据号" style="width: 100%;" />
            </div>
            <!--            <div class="searchList">-->
            <!--              <label for="">操作账号</label>-->
            <!--              <a-input v-model="queryParam.createBy" placeholder="操作账号" style="width: 100%;" />-->
            <!--            </div>-->
            <div class="searchList">
              <label for="">操作时间</label>
              <a-date-picker
                @change="handlePicker"
                :value="queryParam.draftsDate !== null ? moment(queryParam.draftsDate,dateFormat) : null"
              />
            </div>
            <div class="searchList">
              <label for="">单据类型</label>
              <a-select
                style="width: 100%;"
                placeholder="选择单据类型"
                @change="handleDocType"
                v-model="queryParam.draftsType"
              >
                <a-select-option v-for="item in docTypeList" :key="item.code" :value="item.code">{{ item.typeName }}</a-select-option>
              </a-select>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="handleSearchR" size="small">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset" size="small">重置</a-button>
          </span>

        </a-form>
      </a-drawer>
      <s-table
        :locale="{emptyText:emptyText}"
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :pageSize="queryParam.size"
        :pageNum="queryParam.page"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <div class="align-left">
              <div class="tabBtn">
                <a-popover placement="bottomRight" overlayClassName="tableBtn">
                  <template slot="title">
                    <a @click="handleInfo(record)">
                      <i class="iconfont icon-table-edit" />编辑
                    </a>
                    <a @click="handleDelete(record)">
                      <i class="iconfont icon-tableEmpty" />删除
                    </a>
                  </template>
                  <i class="iconfont icon-tableMore" />
                </a-popover>
              </div>
            </div>
          </template>
        </span>
      </s-table>
    </div>
    <depot-empty v-else />
  </a-card>
</template>

<script>
import DhEmpty from '../../comPublic/DhEmpty'
import moment from 'moment'
import { STable } from '@/components'
import { DataFilter } from '@/utils/storage'
import { draftsList, draftsDelete } from '@/api/depot/wareHouse'

const statusMap = {
  0: {
    status: 'error',
    text: '禁用'
  },
  1: {
    status: 'success',
    text: '启用'
  }
}

const docTypeList = [
  {
    typeName: '进货入库',
    code: '01'
  },
  {
    typeName: '退货入库',
    code: '02',
    estateName: '配送商退货入库'
  },
  {
    typeName: '换货入库',
    code: '03'
  },
  {
    typeName: '销售出库',
    code: '11',
    estateName: '配送商销售出库'
  },
  {
    typeName: '退货出库',
    code: '12'
  },
  {
    typeName: '换货出库',
    code: '13'
  },
  {
    typeName: '污损出库',
    code: '15'
  },
  {
    typeName: '污损调拨',
    code: '21'
  },
  {
    typeName: '产品调拨',
    code: '20'
  }
]

export default {
  name: 'WareHouse',
  components: {
    STable,
    moment,
    DhEmpty
  },
  data () {
    const getParams = this.$route.params
    // console.info('drafts---', getParams)
    return {
      emptyText: <dh-empty/>,
      isEmpty: false,
      statusMap,
      isShowSearch: false,
      isAdd: false,
      isDetail: false,
      proInfoData: {},
      docTypeList,
      dateFormat: 'YYYY-MM-DD',
      queryParam: {
        page: getParams.page ? getParams.page : 1,
        size: getParams.size ? getParams.size : 10,
        draftsDate: getParams.draftsDate ? getParams.draftsDate : null,
        docNo: getParams.docNo ? getParams.docNo : null,
        draftsType: getParams.draftsType ? getParams.draftsType : undefined
      },
      columns: [
        {
          title: '单据号码',
          dataIndex: 'docNo',
          align: 'left',
          width: 260
        },
        {
          title: '单据类型',
          dataIndex: 'draftsType',
          align: 'left',
          customRender: (text, record) => {
            return docTypeList.map(item => {
              if (item.code === text) {
                return record.isDistribution === 1 ? item.estateName : item.typeName
              }
            })
          },
          width: 180
        },
        {
          title: '操作账号',
          dataIndex: 'createBy',
          align: 'left',
          width: 180
        },
        {
          title: '操作时间',
          dataIndex: 'createTime',
          align: 'left',
          customRender: (text) => {
            return moment(text).format('YYYY-MM-DD HH:mm:ss')
          },
          width: 200
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 100
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return draftsList(Object.assign(this.queryParam, parameter)).then(res => {
          const draftsList = DataFilter(res, 'drafts')
          this.queryParam.size = res.data.pageSize
          return draftsList
        })
      }
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  methods: {
    moment,
    handleSearch () {
      this.isShowSearch = true
    },
    onSearchClose () {
      this.isShowSearch = false
    },
    handleSearchR () {
      this.isShowSearch = false
      this.$refs.table.refresh(true)
    },
    handleReset () {
      this.queryParam = {
        ...this.queryParam,
        docNo: '',
        createBy: '',
        draftsDate: null,
        draftsType: undefined
      }
    },
    handlePicker (date, dateString) {
      // console.log(date, dateString)
      if (date === null) {
        this.queryParam.draftsDate = date
      } else {
        this.queryParam.draftsDate = moment(dateString).format('YYYY-MM-DD')
      }
      // this.queryParam.docData = moment(date).format('YYYY-MM-DD')
    },
    handleDocType (val) {
      // console.info('val----', val)
    },
    handleInfo (val) {
      let pathTo = ''
      let params = {}
      switch (val.draftsType) {
        case '01':
        case '03':
          pathTo = 'WareHouse_Edit'
          params = {
            proType: 'wareIn',
            pageTitle: '编辑产品入库'
          }
          break
        case '02':
          if (val.isDistribution === 1) {
            pathTo = 'EstateWare_Edit'
            params = {
              proType: 'wareIn',
              pageTitle: '编辑配送商退货入库',
              wareType: 'estate'
            }
          } else {
            pathTo = 'WareHouse_Edit'
            params = {
              proType: 'wareIn',
              pageTitle: '编辑产品入库'
            }
          }
          break
        case '11':
          if (val.isDistribution === 1) {
            pathTo = 'EstateDelivery_Edit'
            params = {
              proType: 'delivery',
              pageTitle: '编辑配送商销售出库',
              wareType: 'estate'
            }
          } else {
            pathTo = 'Delivery_Edit'
            params = {
              proType: 'delivery',
              pageTitle: '编辑产品出库'
            }
          }
          break
        case '12':
        case '13':
          pathTo = 'Delivery_Edit'
          params = {
            proType: 'delivery',
            pageTitle: '编辑产品出库'
          }

          break
        case '15':
        case '21':
          pathTo = 'Stained_Edit'
          params = {
            proType: 'stainedAllot',
            pageTitle: '编辑污损调拨'
          }
          break
        case '20':
          pathTo = 'Allocation_Edit'
          params = {
            proType: 'proAllot',
            pageTitle: '编辑产品调拨'
          }
          break
        case '21':
          pathTo = 'Stained_Edit'
          params = {
            proType: 'proAllot',
            pageTitle: '编辑污损调拨'
          }
          break
        default:
          break
      }
      this.$router.push({
        name: pathTo,
        params: {
          ...params,
          ...this.queryParam,
          docId: val.id,
          docType: val.draftsType,
          parentCom: 'Drafts'

        }
      })
    },
    handleDelete (val) {
      const _that = this
      const params = {
        id: val.id
      }
      this.$confirm({
        title: '提示',
        content: '确定删除该单据?',
        onOk () {
          draftsDelete(params).then(res => {
            // console.info(res)
            if (res.message === 'SUCCESS') {
              _that.$refs.table.refresh(true)
            }
          })
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    }
  },
  watch: {
    $route (to, from) {
      // console.log(to, from);
      if (to.name === 'Drafts') {
        const getParams = this.$router.params
        // console.info('getParams1111---', getParams)
        if (getParams) {
          this.queryParam.page = getParams.page
          this.queryParam.size = getParams.size
        }
        this.$refs.table.refresh(true)
      }
    }
  }
}
</script>

<style lang="less">
  .searchWrap{
    .ant-drawer-content-wrapper{
      background:rgba(251,251,251,1);
      box-shadow:-3px 0px 6px rgba(0,4,123,0.2);
      .ant-drawer-content{
        background:rgba(251,251,251,1);
        .ant-drawer-header{
          border: none;
          background:rgba(251,251,251,1);
          font-size: 14px;
        }
        .ant-drawer-close{
          .anticon{
            color: rgba(148, 148, 148, 1);
            &:hover{
              color: rgba(62, 77, 168, 1);
            }
          }
        }
        .ant-drawer-body{
          padding: 0 24px 24px 24px;
          height: calc(100% - 54px);
          /*overflow-y: auto;*/
          .searchList{
            padding: 0 0 40px 0;
            label{
              color: rgba(147, 147, 147, 1);
              font-size: 14px;
              line-height: 20px;
              margin: 0 0 8px 0;
              width: 100%;
              display: block;
              small{
                color: rgba(225, 120, 119, 1);
                font-size: 14px;
                padding: 0 4px 0 0;
              }
            }
            .ant-calendar-picker{
              max-width: inherit;
            }
            .ant-input{
              border:1px solid rgba(233,233,233,1);
              border-radius: 4px;
              background: white;
              height: 44px;
              line-height: 44px;
              &.ant-calendar-picker-input{
                line-height: 36px;
              }
            }
            .ant-select-selection{
              height: 44px;
              line-height: 44px;
              .ant-select-selection__rendered{
                line-height: 44px;
              }
            }
            .ant-input-number{
              height: 44px;
              line-height: 44px;
            }
          }
          .ant-form{
            height:  100%;
            padding: 0 0 60px 0;
            .searchWrap{
              height:  100%;
              overflow-y: auto;
            }
            position: relative;
            .table-page-search-submitButtons{
              text-align: center;
              width: 100%;
              position: absolute;
              bottom: 0;
              left: 0;
              .ant-btn{
                width: 130px;
                height: 44px;
              }
            }
          }
        }

      }
    }
  }
  .tabBtn{
    .iconfont{
      font-size: 28px;
      color: rgba(196, 196, 196, 1);
    }
    &:hover{
      .iconfont{
        color: rgba(62, 77, 168, 1)!important
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

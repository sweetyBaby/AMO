<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>我的医院销售指标</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <!--            <span class="titleBtn" @click="handleAdd()" v-if="hasPermission('add')">-->
            <!--              <a-tooltip placement="top">-->
            <!--                <template slot="title">-->
            <!--                  <span>新增销售指标</span>-->
            <!--                </template>-->
            <!--                <i class="iconfont icon-plus" />-->
            <!--              </a-tooltip>-->
            <!--            </span>-->
            <span class="titleBtn" @click="handleExport()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出</span>
                </template>
                <i class="iconfont icon-exeptOut" />
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
              <label for>医院名称</label>
              <!--              <a-select-->
              <!--                placeholder="请选择医院名称"-->
              <!--                style="width: 100%"-->
              <!--                v-model="queryParam.distCode"-->
              <!--                :filterOption="filterOption"-->
              <!--                showSearch-->
              <!--              >-->
              <!--                <a-select-option-->
              <!--                  v-for=" (item,index) in distList"-->
              <!--                  :value="item.distCode"-->
              <!--                  :key="index"-->
              <!--                >{{ item.distName }}</a-select-option>-->
              <!--              </a-select>-->
              <a-input placeholder="请输入医院名称" v-model="queryParam.hosName"></a-input>
            </div>
            <div class="searchList">
              <label for="">月份</label>
              <a-month-picker
                placeholder="请选择月份"
                style="width: 100%"
                :value="isDate ? moment(queryParam.date, dataformat) : null"
                @change="handleDate"
                :format="dataformat"
              ></a-month-picker>
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" size="small" @click="retriveTable">查询</a-button>
            <a-button style="margin-left: 8px" size="small" @click="handleReset">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :pageSize="queryParam.size"
        :locale="{emptyText:emptyText}"
      >
        <!-- <span slot="isPrimary" slot-scope="text">
          <span :status-map="orPrimary">{{orPrimary[text].text}}</span>
        </span>
        <span slot="type" slot-scope="text">
          <span :status-map="typeWareHouse">{{typeWareHouse[text].text}}</span>
        </span>-->
        <!-- <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span> -->
        <span slot="action" slot-scope="text, record">
          <a-popover placement="bottomRight" overlayClassName="tableBtn" v-model="record.isEdit">
            <template slot="title">
              <a href="javascript:;" @click="handleResult(record)" v-if="hasPermission('detail')">
                <i class="iconfont icon-info" />查看详情
              </a>
            </template>
            <span>
              <i class="iconfont icon-tableMore" style="font-size:28px" />
            </span>
          </a-popover>
        </span>
      </s-table>
    </div>
  </a-card>
  <a-card v-else :bordered="false">
    <add-hos-sale :tableData="tableInfo" @handleNewSN="handleChange()" />
  </a-card>
</template>

<script>
import moment from 'moment'
import DhEmpty from '@/views/comPublic/DhEmpty'
import { Icon } from 'ant-design-vue'
import { userDistRange } from '@/api/depot/wareHouse'
import { myHostQuoList, hosQuoDelete } from '@/api/basicInfo/hosData'
import notification from 'ant-design-vue/es/notification'
import AddHosSale from './modules/AddHosSale'
import { DataFilter, BtnShow, exportTable, exportTabList, setStore } from '@/utils/storage'
import { STable } from '@/components'

export default {
  name: 'HospitalSales',
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  // create生命周期只加载一次
  created () {
    this.getFirstLoad()
    const params = {
      distCode: this.$store.state.user.info.distCode
    }
    userDistRange(params).then(res => {
      // console.info('====',res)
      this.distList = res.data
    })
  },
  components: {
    STable,
    AddHosSale,
    DhEmpty
  },
  data () {
    return {
      btnPermission: [],
      emptyText: <dh-empty />,
      distList: [],
      isShowSearch: false,
      isEmpty: false,
      tableDatas: [],
      tableInfo: {},
      modelList: [],
      isShowResult: false,
      resultData: {},
      salesStyle: {
        'text-align': 'center',
        'line-height': '46px'
      },
      columns: [
        {
          width: 150,
          title: '医院名称',
          dataIndex: 'hosName',
          key: 'hosName'
        },
        // {
        //   width: 150,
        //   title: '产品型号',
        //   dataIndex: 'whName',
        //   key: 'whName'
        // },
        {
          width: 150,
          title: '月份',
          dataIndex: 'month',
          key: 'month',
          customRender: (text, record) => {
            return (record.year && record.month) ? record.year + '-' + record.month : null
          }
        },
        {
          width: 150,
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          customRender: (text) => {
            return text ? moment(text).format('YYYY-MM-DD HH:mm') : null
          }
        },
        {
          width: 150,
          title: '更新时间',
          dataIndex: 'updateTime',
          key: 'updateTime',
          customRender: (text) => {
            return text ? moment(text).format('YYYY-MM-DD HH:mm') : null
          }
        },
        {
          width: 150,
          title: '备注',
          dataIndex: 'remark',
          key: 'remark'
        }
      ],
      isAdd: false,
      orPrimary: {
        0: {
          systemStatus: '0',
          text: '否'
        },
        1: {
          systemStatus: '1',
          text: '是'
        }
      },
      typeWareHouse: {
        1: {
          type: '1',
          text: '自有主库'
        },
        3: {
          type: '3',
          text: '自由寄售'
        },
        2: {
          type: '2',
          text: '华润寄售'
        },
        4: {
          type: '4',
          text: '污损库'
        },
        5: {
          type: '5',
          text: '污损库'
        }
      },
      cooperInfo: [], // 点击修改向子级传递参数
      tableList: [],
      // 查询参数
      queryParam: {
        month: null,
        hosName: '',
        page: 1,
        size: 10
      },
      dataformat: 'YYYY-MM',
      isDate: false,
      isEdit: false,
      loadData: parameter => {
        return myHostQuoList(Object.assign(this.queryParam, parameter)).then(
          res => {
            const myhosList = DataFilter(res, 'myhosList')
            this.tableList = myhosList
            this.queryParam.size = res.data.pageSize
            return myhosList
          }
        )
      }
    }
  },
  methods: {
    moment,
    hasPermission (val) {
      return this.btnPermission.indexOf(val) !== -1
    },
    getFirstLoad () {
      const current = this.$route.path.split('/')
      const currentRoute = current[current.length - 1]
      this.btnPermission = BtnShow(currentRoute)
      if (this.hasPermission('detail')) {
        this.columns.push({
          width: 100,
          align: 'center',
          title: '操作',
          scopedSlots: {
            customRender: 'action'
          }
        })
      }
    },
    isAfter (record) {
      if (moment(record.year + '-' + record.month).isAfter(moment().endOf('month')) ||
        (moment(record.month).isSame(moment().format('MM')) && Number(moment().format('DD')) < 16)
      ) {
        return true
      }
      return false
    },
    handleDate (date) {
      // console.info('date===', date)
      if (date === null || date.length === 0) {
        this.isDate = false
        this.queryParam.date = null
      } else {
        this.queryParam.date = date
        this.isDate = true
      }
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    retriveTable () {
      // console.info('this.queryParam.date===', this.queryParam.date)
      this.queryParam.date = this.queryParam.date ? moment(this.queryParam.date).format('YYYY-MM') : null
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    handleReset () {
      this.isDate = false
      this.queryParam = {
        page: 1,
        size: 10,
        month: null,
        hosName: ''
      }
    },
    handleSearch () {
      this.isShowSearch = true
    },

    onSearchClose () {
      this.isShowSearch = false
    },

    handleChange () {
      this.isAdd = false
    },

    handleAdd (val) {
      const _that = this
      const callback = function () {
        _that.isAdd = false
        // console.log("销毁");
        window.removeEventListener('popstate', callback)
      }
      history.pushState(
        null,
        null,
        '/more/information/HospitalSales#detail'
      )
      window.addEventListener('popstate', callback)
      if (val) {
        this.tableInfo = val
      } else {
        this.tableInfo = []
      }
      this.isAdd = true
    },
    // 查看达成率
    handleResult (record) {
      const params = {
        backUrl: 'MyHospitalSales',
        type: 'myhos',
        data: record
      }
      setStore('HOSSALES', params)
      this.$router.push({
        path: 'MyHospitalSales_Detail'
      })
    },
    handleCancle () {
      this.isShowResult = false
    },
    handleInfo () {
      this.isShowResult = false
    },
    handleExport () {
      // console.info('this.tableList.data====', this.tableList)
      if (exportTabList(this.tableList)) {
        this.loadingSpin = true
        this.queryParam = {
          ...this.queryParam,
          page: undefined,
          size: undefined
        }
        exportTable(
          this.tableList.data,
          this.queryParam,
          '/amo/hosQuotaConfig/export',
          '医院销售指标',
          true
        ).then(res => {
          this.loadingSpin = false
        })
      }
    },
    deleData (record) {
      if (record.isEdit) {
        this.$confirm({
          title: '删除确认',
          content: '是否确定删除【' + record.hosName + '】销量指标',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            const params = {
              id: record.id
            }
            hosQuoDelete(params).then(res => {
              if (res.message === 'SUCCESS') {
                this.$refs.table.refresh(true)
              } else {
                notification.error({
                  message: '错误',
                  description: res.data
                })
              }
            })
          }
        })
        record.isEdit = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tableBtn .ant-popover-title {
  padding: 0;
  min-width: 160px;
  a {
    width: 100%;
    padding: 8px 0 8px 32px;
    color: rgba(147, 147, 147, 1);
    display: inline-block;
    box-sizing: border-box;
    .iconfont {
      font-size: 19px;
      color: rgba(147, 147, 147, 1);
      padding: 0 12px 0 0;
    }
    &:hover {
      background: rgba(246, 246, 248, 1);
      color: rgba(21, 58, 175, 1);
      .iconfont {
        color: rgba(21, 58, 175, 1);
      }
    }
  }
}
/* 搜索样式 */
.searchWrap {
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
            background: white;
            height: 44px;
            line-height: 44px;

            &.ant-calendar-picker-input {
              line-height: 36px;
            }
          }
          .ant-calendar-picker{
            max-width: inherit;
          }
        }

        .ant-form {
          height: 100%;
          padding: 0 0 60px 0;

          .searchWrap {
            height: 100%;
            overflow-y: auto;
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
</style>

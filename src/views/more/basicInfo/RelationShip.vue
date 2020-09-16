<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>医院授权关系</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <!--            <span class="titleBtn">-->
            <!--              <a-tooltip placement="top">-->
            <!--                <template slot="title">-->
            <!--                  <span>下载模板</span>-->
            <!--                </template>-->
            <!--                <a-->
            <!--                    style="text-decoration: none;"-->
            <!--                    href="https://cdcs.oss-cn-shanghai.aliyuncs.com/webroot/amo/template/%E4%BA%A7%E5%93%81%E5%85%A5%E5%BA%93%E4%B8%8A%E6%8A%A5%E6%A8%A1%E6%9D%BF.xlsx">-->
            <!--                  <i class="iconfont icon-down"/>-->
            <!--                </a>-->
            <!--              </a-tooltip>-->
            <!--            </span>-->
            <!--            <span class="titleBtn">-->
            <!--              <a-upload-->
            <!--                  :showUploadList="showUploadList"-->
            <!--                  action="/amo/document/importExcelProduct"-->
            <!--                  :headers="headerUpload"-->
            <!--                  @change="handleChange"-->
            <!--              >-->
            <!--                <a-tooltip placement="top">-->
            <!--                  <template slot="title">-->
            <!--                    <span>上传模板</span>-->
            <!--                  </template>-->
            <!--                  <i class="iconfont icon-up" />-->
            <!--                </a-tooltip>-->
            <!--              </a-upload>-->
            <!--            </span>-->
            <span class="titleBtn" @click="handleAdd()" v-if="hasPermission('add')">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>新增医院授权关系</span>
                </template>
                <i class="iconfont icon-plus" />
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
              <label for>选择经销商名称</label>
              <a-select
                placeholder="请选择经销商名称"
                style="width: 100%"
                v-model="queryParam.distCode"
                :filterOption="filterOption"
                showSearch
              >
                <a-select-option
                  v-for=" (item,index) in distList"
                  :value="item.distCode"
                  :key="index"
                >{{ item.distName }}</a-select-option>
              </a-select>
            </div>
            <div class="searchList">
              <label for>经销商代码</label>
              <a-input
                v-model="queryParam.distCode"
                placeholder="经销商代码"
                style="width: 100%"
                :disabled="true"
              ></a-input>
            </div>
            <div class="searchList">
              <label for>医院名称</label>
              <a-input
                placeholder="请选择医院名称"
                @click="handleSelectCus"
                style="width: 100%"
                v-model="queryParam.hosName"
              />
            </div>
            <div class="searchList">
              <label for="">医院代码</label>
              <a-input
                placeholder="医院代码"
                v-model="queryParam.hosCode"
                style="width: 100%"
                :disabled="true"
              ></a-input>
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
        <!-- 名称超出省略  -->
        <template slot="cusName" slot-scope="name">
          <a-tooltip placement="top" :title="name">
            <span class="serialName">{{ name }}</span>
          </a-tooltip>
        </template>
        <!--操作-->
        <span slot="action" slot-scope="text, record">
          <a-popover placement="bottomRight" overlayClassName="tableBtn">
            <template slot="title">
              <a href="javascript:;" @click="handleAdd(record)" v-if="hasPermission('edit')">
                <i class="iconfont icon-table-edit" /> 编辑
              </a>
              <a href="javascript:;" @click="handleDetail(record)" v-if="hasPermission('detail')">
                <i class="iconfont icon-info" /> 查看详情
              </a>
              <a href="javascript:;" @click="handleDel(record)" v-if="hasPermission('delete')">
                <i class="iconfont icon-empty" /> 删除
              </a>
            </template>
            <span>
              <i class="iconfont icon-tableMore" style="font-size:28px" />
            </span>
          </a-popover>
        </span>
      </s-table>
    </div>
    <select-cus-name
      v-if="selectShow"
      :visible="selectShow"
      :cusData="cusData"
      @selectCus="handleSelectOk"
      @selectCancle="handleSelectCancle"
    ></select-cus-name>
  </a-card>
</template>

<script>
import moment from 'moment'
import DhEmpty from '@/views/comPublic/DhEmpty'
import { Icon } from 'ant-design-vue'
import { userDistRange } from '@/api/depot/wareHouse'
import { distHosList, getProductType, relationList, relationDel } from '@/api/basicInfo/hosData'
import notification from 'ant-design-vue/es/notification'
import { DataFilter, BtnShow, exportTable, exportTabList, setStore } from '@/utils/storage'
import { STable } from '@/components'
import SelectCusName from '@/views/comPublic/modules/SelectCusName'

export default {
  name: 'RelationShip',
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
    SelectCusName,
    DhEmpty
  },
  computed: {
    headerUpload () {
      return {
        Authorization: 'Bearer ' + this.$store.state.user.token
      }
    }
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
      typeList: [],
      isShowResult: false,
      resultData: {},
      selectShow: false,
      showUploadList: false,
      cusData: {
        distCode: this.$store.state.user.info.distCode,
        type: 'all'
      },
      salesStyle: {
        'text-align': 'center',
        'line-height': '46px'
      },
      columns: [
        {
          width: 150,
          title: '医院代码',
          dataIndex: 'hosCode',
          key: 'hosCode'
        },
        {
          width: 150,
          title: '医院名称',
          dataIndex: 'hosName',
          key: 'hosName',
          scopedSlots: {
            customRender: 'cusName'
          }
        },
        {
          width: 150,
          title: '经销商代码',
          dataIndex: 'distCode',
          key: 'distCode'
        },
        {
          width: 150,
          title: '经销商名称',
          dataIndex: 'distName',
          key: 'distName',
          scopedSlots: {
            customRender: 'cusName'
          }
        },
        {
          width: 150,
          title: '经销商所属大区',
          dataIndex: 'dictName',
          key: 'dictName'
        },
        {
          width: 150,
          title: '生效日期',
          dataIndex: 'effectiveDateBegin',
          key: 'effectiveDateBegin'
        },
        {
          width: 150,
          title: '失效日期',
          dataIndex: 'effectiveDateEnd',
          key: 'effectiveDateEnd'
        },
        {
          width: 150,
          title: '创建日期',
          dataIndex: 'createTime',
          key: 'createTime',
          customRender: (text) => {
            return text ? moment(text).format('YYYY-MM-DD HH:mm') : null
          }
        }
        // {
        //   width: 150,
        //   title: '备注',
        //   dataIndex: 'remark',
        //   key: 'remark'
        // }
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
        date: null,
        distName: '请选择经销商',
        distCode: undefined,
        hosName: '请选择医院名称',
        hosCode: null,
        page: 1,
        size: 10
      },
      dataformat: 'YYYY-MM',
      isDate: false,
      loadData: parameter => {
        return relationList(Object.assign(this.queryParam, parameter)).then(
          res => {
            const relation = DataFilter(res, 'relation')
            this.tableList = relation
            this.queryParam.size = res.data.pageSize
            return relation
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
      if (this.hasPermission('detail') || this.hasPermission('edit') || this.hasPermission('delete')) {
        this.columns.push({
          width: 100,
          align: 'center',
          title: '操作',
          scopedSlots: {
            customRender: 'action'
          }
        })
      }
      this.getTypeList()
    },
    getTypeList () {
      const params = {
        productModel: ''
      }
      getProductType(params).then(res => {
        const typeData = []
        if (res.message === 'SUCCESS') {
          res.data.map(item => {
            if (item && item !== null) {
              typeData.push(item.productType)
            }
          })
          this.typeList = typeData
        } else {
          notification.error({
            message: '错误',
            description: '请求型号数据返回失败！'
          })
        }
      })
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
    handleChange (info) { // 上传结果
      this.uploading = true
      window.clearInterval(this.timer)
      this.timer = window.setInterval(() => {
        this.percent = parseInt(this.percent) + 1
        // console.log(this.percent)
      }, 1000)
      if (info.file.status === 'done') {
        this.percent = 100
        window.clearInterval(this.timer)
        this.uploading = false
        this.percent = 0
        this.$notification['success']({
          message: '提示',
          description: '上传成功！',
          duration: 4
        })
        this.$router.push({ name: 'FileManagement' })
        // this.$refs.table.refresh(true)
      } else if (info.file.status === 'error') {
        this.uploading = false
        window.clearInterval(this.timer)
        this.$notification['error']({
          message: '上传失败',
          description: '上传失败！',
          duration: 4
        })
      }
    },
    retriveTable () {
      // console.info('this.queryParam.month===', this.queryParam.month)
      this.queryParam.date = this.queryParam.date ? moment(this.queryParam.date).format('YYYY-MM') : null
      this.$refs.table.refresh(true)
      this.isShowSearch = false
    },
    handleReset () {
      this.isDate = false
      this.queryParam = {
        page: 1,
        size: 10,
        distCode: undefined,
        distName: '',
        hosCode: null,
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
    handleSelectCus () {
      // console.info('3333')
      this.selectShow = true
    },
    // 选择客户名称弹框
    handleSelectOk (subVal) {
      // console.info('subVal====',subVal)
      this.hosCode = subVal.cusCode
      this.queryParam.hosName = subVal.cusName
      this.queryParam.hosCode = subVal.cusCode
      this.selectShow = false
    },
    handleSelectCancle () {
      this.selectShow = false
    },
    handleAdd (val) {
      setStore('RELATIONSHIPADD', val)
      this.$router.push({
        path: 'RelationShip_Edit'
      })
    },
    handleDetail (record) {
      setStore('RELATIONDETAIL', record)
      this.$router.push({
        path: 'RelationShip_Detail'
      })
    },
    handleDel (record) {
      const params = {
        id: record.id
      }
      relationDel(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.$notification['success']({
            message: '提示',
            description: '删除成功！',
            duration: 2
          })
          this.$refs.table.refresh(true)
        } else {
          this.$notification['error']({
            message: '提示',
            description: res.message || '删除失败！',
            duration: 2
          })
        }
      })
      console.info('record===', record)
    },
    // 查看达成率
    handleResult () {
      this.isShowResult = true
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
          '/amo/distHosQuotaConfig/export ',
          '指标达成率',
          true
        ).then(res => {
          this.loadingSpin = false
        })
      }
    },
    deleData (record) {
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
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'RelationShip') {
        this.$refs.table.refresh(true)
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

.serialName {
  max-width: 140px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
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
</style>
